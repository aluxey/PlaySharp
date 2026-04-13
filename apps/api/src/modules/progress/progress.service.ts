import { Inject, Injectable } from '@nestjs/common';

import type {
  ContentCatalog,
  ContentGameName,
  ProgressOverview,
  ProgressThemeInsight,
  ProgressTrendPoint,
  RecurringMistake,
} from '@playsharp/shared';

import { ContentService } from '../content/content.service';
import { PrismaService } from '../prisma/prisma.service';

type AttemptAnswerRecord = {
  finishedAt: Date;
  game: ContentGameName;
  themeSlug: string;
  themeName: string;
  questionSlug: string;
  questionTitle: string;
  isCorrect: boolean;
};

type QuizAttemptRecord = {
  finishedAt: Date | null;
  questionAttempts: ReadonlyArray<{
    isCorrect: boolean;
    question: {
      slug: string;
      title: string;
      theme: {
        slug: string;
        name: string;
        game: {
          name: string;
        };
      };
    };
  }>;
};

type DailyUsageRecord = {
  date: Date;
  questionsAnswered: number;
};

const weeklyTrendFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fromDateKey(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function addUtcDays(date: Date, amount: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + amount));
}

function utcDayDistance(left: Date, right: Date) {
  return Math.round((left.getTime() - right.getTime()) / (24 * 60 * 60 * 1000));
}

function toSharedGameName(gameName: string): ContentGameName {
  return gameName === 'BLACKJACK' ? 'blackjack' : 'poker';
}

function calculateAccuracy(correctCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((correctCount / totalCount) * 100);
}

@Injectable()
export class ProgressService {
  constructor(
    @Inject(ContentService) private readonly contentService: ContentService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getOverview(userId: string): Promise<ProgressOverview> {
    const quizAttemptsPromise = this.prisma.quizAttempt.findMany({
      where: {
        userId,
        finishedAt: {
          not: null,
        },
      },
      orderBy: {
        finishedAt: 'asc',
      },
      select: {
        finishedAt: true,
        questionAttempts: {
          select: {
            isCorrect: true,
            question: {
              select: {
                slug: true,
                title: true,
                theme: {
                  select: {
                    slug: true,
                    name: true,
                    game: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }) as Promise<ReadonlyArray<QuizAttemptRecord>>;
    const dailyUsagePromise = this.prisma.dailyUsage.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: {
        date: true,
        questionsAnswered: true,
      },
    }) as Promise<ReadonlyArray<DailyUsageRecord>>;
    const [catalog, quizAttempts, dailyUsage] = await Promise.all([
      this.contentService.getCatalog(),
      quizAttemptsPromise,
      dailyUsagePromise,
    ]);
    const answers = quizAttempts.flatMap((attempt) => {
      if (attempt.finishedAt === null) {
        return [];
      }

      const finishedAt = attempt.finishedAt;

      return attempt.questionAttempts.map(
        (questionAttempt): AttemptAnswerRecord => ({
          finishedAt,
          game: toSharedGameName(questionAttempt.question.theme.game.name),
          themeSlug: questionAttempt.question.theme.slug,
          themeName: questionAttempt.question.theme.name,
          questionSlug: questionAttempt.question.slug,
          questionTitle: questionAttempt.question.title,
          isCorrect: questionAttempt.isCorrect,
        }),
      );
    });
    const totalLessons = catalog.reduce(
      (total, game) => total + game.themes.reduce((sum, theme) => sum + theme.lessons.length, 0),
      0,
    );
    const overallAccuracy = calculateAccuracy(
      answers.filter((answer) => answer.isCorrect).length,
      answers.length,
    );
    const weeklyAccuracy = this.buildWeeklyTrend(answers, overallAccuracy);
    const themeInsights = this.buildThemeInsights(answers);
    const weakestTheme =
      [...themeInsights].sort((left, right) => left.accuracy - right.accuracy)[0] ?? null;
    const masteredThemes = themeInsights.filter((theme) => theme.accuracy >= 70);
    const lessonsCompleted = this.buildLessonsCompleted(masteredThemes, catalog, totalLessons);

    return {
      summary: {
        overallAccuracy,
        questionsAnswered: answers.length,
        currentStreak: this.buildCurrentStreak(dailyUsage),
        lessonsCompleted,
        totalLessons,
        weeklyChange: this.buildWeeklyChange(answers),
      },
      weeklyAccuracy,
      themesToImprove: [...themeInsights].sort((left, right) => left.accuracy - right.accuracy),
      recurringMistakes: this.buildRecurringMistakes(answers),
      recommendation:
        weakestTheme === null
          ? null
          : {
              title: `Revisit ${weakestTheme.themeName}`,
              description: `Accuracy is ${weakestTheme.accuracy}% in ${weakestTheme.themeName}. Review the lesson path, then run another quiz set while the spot is still fresh.`,
              actionLabel: 'Open lessons',
              href: '/lessons',
            },
    };
  }

  private buildLessonsCompleted(
    masteredThemes: ReadonlyArray<ProgressThemeInsight>,
    catalog: ContentCatalog,
    totalLessons: number,
  ) {
    if (masteredThemes.length === 0) {
      return 0;
    }

    const themeLessonCounts = new Map(
      catalog.flatMap((game) =>
        game.themes.map((theme) => [`${game.game}:${theme.slug}`, theme.lessons.length] as const),
      ),
    );
    const estimatedCompleted = masteredThemes.reduce(
      (sum, theme) => sum + (themeLessonCounts.get(`${theme.game}:${theme.themeSlug}`) ?? 0),
      0,
    );

    return Math.min(totalLessons, estimatedCompleted);
  }

  private buildCurrentStreak(
    dailyUsage: ReadonlyArray<{
      date: Date;
      questionsAnswered: number;
    }>,
  ) {
    const activeDays = dailyUsage.filter((entry) => entry.questionsAnswered > 0);

    if (activeDays.length === 0) {
      return 0;
    }

    const today = fromDateKey(toDateKey(new Date()));
    const latestEntry = activeDays[0];

    if (!latestEntry) {
      return 0;
    }

    const latestDay = fromDateKey(toDateKey(latestEntry.date));

    if (utcDayDistance(today, latestDay) > 1) {
      return 0;
    }

    let streak = 0;
    let previousDay = latestDay;

    for (const entry of activeDays) {
      const currentDay = fromDateKey(toDateKey(entry.date));
      const distance = utcDayDistance(previousDay, currentDay);

      if (distance === 0) {
        continue;
      }

      if (distance > 1) {
        break;
      }

      streak += 1;
      previousDay = currentDay;
    }

    return streak === 0 ? 1 : streak + 1;
  }

  private buildWeeklyChange(answers: ReadonlyArray<AttemptAnswerRecord>) {
    if (answers.length === 0) {
      return 0;
    }

    const today = fromDateKey(toDateKey(new Date()));
    const currentStart = addUtcDays(today, -6);
    const previousStart = addUtcDays(today, -13);
    const currentAnswers = answers.filter((answer) => answer.finishedAt >= currentStart);
    const previousAnswers = answers.filter(
      (answer) => answer.finishedAt >= previousStart && answer.finishedAt < currentStart,
    );
    const currentAccuracy = calculateAccuracy(
      currentAnswers.filter((answer) => answer.isCorrect).length,
      currentAnswers.length,
    );
    const previousAccuracy = calculateAccuracy(
      previousAnswers.filter((answer) => answer.isCorrect).length,
      previousAnswers.length,
    );

    return currentAccuracy - previousAccuracy;
  }

  private buildWeeklyTrend(
    answers: ReadonlyArray<AttemptAnswerRecord>,
    overallAccuracy: number,
  ): ReadonlyArray<ProgressTrendPoint> {
    const accuracyByDay = new Map<
      string,
      {
        correctCount: number;
        totalCount: number;
      }
    >();

    for (const answer of answers) {
      const key = toDateKey(answer.finishedAt);
      const stats = accuracyByDay.get(key) ?? { correctCount: 0, totalCount: 0 };

      stats.totalCount += 1;
      stats.correctCount += answer.isCorrect ? 1 : 0;
      accuracyByDay.set(key, stats);
    }

    const today = fromDateKey(toDateKey(new Date()));
    const fallbackAccuracy = answers.length === 0 ? 50 : Math.max(overallAccuracy, 50);

    return Array.from({ length: 7 }, (_, index) => addUtcDays(today, index - 6)).map((date) => {
      const key = toDateKey(date);
      const stats = accuracyByDay.get(key);

      return {
        day: weeklyTrendFormatter.format(date),
        accuracy: stats
          ? calculateAccuracy(stats.correctCount, stats.totalCount)
          : fallbackAccuracy,
      };
    });
  }

  private buildThemeInsights(
    answers: ReadonlyArray<AttemptAnswerRecord>,
  ): ReadonlyArray<ProgressThemeInsight> {
    const today = fromDateKey(toDateKey(new Date()));
    const currentStart = addUtcDays(today, -6);
    const previousStart = addUtcDays(today, -13);
    const groupedThemes = new Map<
      string,
      {
        game: ContentGameName;
        themeSlug: string;
        themeName: string;
        totalCount: number;
        correctCount: number;
        currentTotal: number;
        currentCorrect: number;
        previousTotal: number;
        previousCorrect: number;
      }
    >();

    for (const answer of answers) {
      const key = `${answer.game}:${answer.themeSlug}`;
      const stats = groupedThemes.get(key) ?? {
        game: answer.game,
        themeSlug: answer.themeSlug,
        themeName: answer.themeName,
        totalCount: 0,
        correctCount: 0,
        currentTotal: 0,
        currentCorrect: 0,
        previousTotal: 0,
        previousCorrect: 0,
      };

      stats.totalCount += 1;
      stats.correctCount += answer.isCorrect ? 1 : 0;

      if (answer.finishedAt >= currentStart) {
        stats.currentTotal += 1;
        stats.currentCorrect += answer.isCorrect ? 1 : 0;
      } else if (answer.finishedAt >= previousStart && answer.finishedAt < currentStart) {
        stats.previousTotal += 1;
        stats.previousCorrect += answer.isCorrect ? 1 : 0;
      }

      groupedThemes.set(key, stats);
    }

    return Array.from(groupedThemes.values()).map((theme) => ({
      game: theme.game,
      themeSlug: theme.themeSlug,
      themeName: theme.themeName,
      accuracy: calculateAccuracy(theme.correctCount, theme.totalCount),
      questionCount: theme.totalCount,
      improvement:
        calculateAccuracy(theme.currentCorrect, theme.currentTotal) -
        calculateAccuracy(theme.previousCorrect, theme.previousTotal),
    }));
  }

  private buildRecurringMistakes(
    answers: ReadonlyArray<AttemptAnswerRecord>,
  ): ReadonlyArray<RecurringMistake> {
    const groupedMistakes = new Map<
      string,
      {
        questionSlug: string;
        themeName: string;
        label: string;
        occurrences: number;
        lastSeen: Date;
      }
    >();

    for (const answer of answers) {
      if (answer.isCorrect) {
        continue;
      }

      const key = `${answer.themeSlug}:${answer.questionSlug}`;
      const mistake = groupedMistakes.get(key) ?? {
        questionSlug: answer.questionSlug,
        themeName: answer.themeName,
        label: answer.questionTitle,
        occurrences: 0,
        lastSeen: answer.finishedAt,
      };

      mistake.occurrences += 1;
      if (answer.finishedAt > mistake.lastSeen) {
        mistake.lastSeen = answer.finishedAt;
      }

      groupedMistakes.set(key, mistake);
    }

    return Array.from(groupedMistakes.values())
      .sort((left, right) => {
        if (right.occurrences !== left.occurrences) {
          return right.occurrences - left.occurrences;
        }

        return right.lastSeen.getTime() - left.lastSeen.getTime();
      })
      .slice(0, 4)
      .map((mistake) => ({
        questionSlug: mistake.questionSlug,
        themeName: mistake.themeName,
        label: mistake.label,
        occurrences: mistake.occurrences,
        lastSeen: shortDateFormatter.format(mistake.lastSeen),
      }));
  }
}
