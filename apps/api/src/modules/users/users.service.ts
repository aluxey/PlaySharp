import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';

import type {
  ContentGame,
  ContentGameName,
  ProfileOverview,
  ProfileQuizScore,
  ProfileStat,
} from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { ContentService } from '../content/content.service';
import { PrismaService } from '../prisma/prisma.service';

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function buildInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fromDateKey(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
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

type RecentAttemptRecord = {
  finishedAt: Date | null;
  score: number;
  game: {
    name: string;
  };
  questionAttempts: ReadonlyArray<{
    question: {
      theme: {
        name: string;
      };
    };
  }>;
};

type ThemeAttemptRecord = {
  isCorrect: boolean;
  question: {
    theme: {
      slug: string;
      game: {
        name: string;
      };
    };
  };
};

type DailyUsageRecord = {
  date: Date;
  questionsAnswered: number;
};

@Injectable()
export class UsersService {
  constructor(
    @Inject(ContentService) private readonly contentService: ContentService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getProfileOverview(userId: string): Promise<ProfileOverview> {
    const [catalog, user] = await Promise.all([
      this.contentService.getCatalog(),
      this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: true,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(
        createApiError(HttpStatus.NOT_FOUND, 'AUTH_USER_NOT_FOUND', `Missing user: ${userId}`),
      );
    }

    const totalLessons = catalog.reduce(
      (total, game) => total + game.themes.reduce((sum, theme) => sum + theme.lessons.length, 0),
      0,
    );
    const [
      quizzesCompleted,
      totalQuestionAttempts,
      correctQuestionAttempts,
      recentAttempts,
      themeAttempts,
      dailyUsage,
    ] = await Promise.all([
      this.prisma.quizAttempt.count({
        where: {
          userId,
          finishedAt: {
            not: null,
          },
        },
      }),
      this.prisma.questionAttempt.count({
        where: {
          quizAttempt: {
            userId,
            finishedAt: {
              not: null,
            },
          },
        },
      }),
      this.prisma.questionAttempt.count({
        where: {
          isCorrect: true,
          quizAttempt: {
            userId,
            finishedAt: {
              not: null,
            },
          },
        },
      }),
      this.prisma.quizAttempt.findMany({
        where: {
          userId,
          finishedAt: {
            not: null,
          },
        },
        orderBy: {
          finishedAt: 'desc',
        },
        take: 4,
        select: {
          finishedAt: true,
          score: true,
          game: {
            select: {
              name: true,
            },
          },
          questionAttempts: {
            select: {
              question: {
                select: {
                  theme: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }) as Promise<ReadonlyArray<RecentAttemptRecord>>,
      this.prisma.questionAttempt.findMany({
        where: {
          quizAttempt: {
            userId,
            finishedAt: {
              not: null,
            },
          },
        },
        select: {
          isCorrect: true,
          question: {
            select: {
              theme: {
                select: {
                  slug: true,
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
      }) as Promise<ReadonlyArray<ThemeAttemptRecord>>,
      this.prisma.dailyUsage.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        select: {
          date: true,
          questionsAnswered: true,
        },
      }) as Promise<ReadonlyArray<DailyUsageRecord>>,
    ]);
    const overallAccuracy = calculateAccuracy(correctQuestionAttempts, totalQuestionAttempts);
    const currentStreak = this.buildCurrentStreak(dailyUsage);
    const lessonsCompleted = this.buildLessonsCompleted(themeAttempts, catalog, totalLessons);
    const stats = this.buildStats({
      overallAccuracy,
      quizzesCompleted,
      lessonsCompleted,
      totalLessons,
      currentStreak,
    });

    return {
      user: {
        name: user.name,
        initials: buildInitials(user.name),
        email: user.email,
        memberSince: user.createdAt.toISOString(),
        memberSinceLabel: formatFullDate(user.createdAt),
        plan: user.plan === 'PREMIUM' ? 'premium' : 'free',
        planLabel: user.plan === 'PREMIUM' ? 'Premium Member' : 'Free Plan',
        renewalDate: user.subscription?.currentPeriodEnd
          ? formatFullDate(user.subscription.currentPeriodEnd)
          : null,
      },
      stats,
      recentQuizScores: this.buildRecentQuizScores(recentAttempts),
      achievements: [
        { icon: '🔥', name: 'Week Streak', unlocked: currentStreak >= 7 },
        {
          icon: '🎯',
          name: 'Perfect Round',
          unlocked: recentAttempts.some(
            (attempt) =>
              attempt.questionAttempts.length > 0 &&
              attempt.score === attempt.questionAttempts.length,
          ),
        },
        {
          icon: '📚',
          name: 'Lesson Finisher',
          unlocked: lessonsCompleted >= totalLessons && totalLessons > 0,
        },
        { icon: '⚡', name: 'Quiz Volume', unlocked: quizzesCompleted >= 10 },
        {
          icon: '🏆',
          name: 'Advanced Table',
          unlocked: overallAccuracy >= 80 && totalQuestionAttempts >= 20,
        },
        {
          icon: '💎',
          name: 'Elite Accuracy',
          unlocked: overallAccuracy >= 90 && totalQuestionAttempts >= 50,
        },
      ],
    };
  }

  private buildStats(input: {
    overallAccuracy: number;
    quizzesCompleted: number;
    lessonsCompleted: number;
    totalLessons: number;
    currentStreak: number;
  }): ReadonlyArray<ProfileStat> {
    return [
      {
        key: 'overallAccuracy',
        label: 'Overall Accuracy',
        value: `${input.overallAccuracy}%`,
      },
      {
        key: 'quizzesCompleted',
        label: 'Quizzes Completed',
        value: `${input.quizzesCompleted}`,
      },
      {
        key: 'lessonsCompleted',
        label: 'Lessons Completed',
        value: `${input.lessonsCompleted}/${input.totalLessons}`,
      },
      {
        key: 'currentStreak',
        label: 'Current Streak',
        value: `${input.currentStreak} days`,
      },
    ];
  }

  private buildRecentQuizScores(
    attempts: ReadonlyArray<RecentAttemptRecord>,
  ): ReadonlyArray<ProfileQuizScore> {
    return attempts.flatMap((attempt) => {
      if (!attempt.finishedAt) {
        return [];
      }

      const themes = [
        ...new Set(attempt.questionAttempts.map((entry) => entry.question.theme.name)),
      ].join(', ');

      return {
        name: `${toSharedGameName(attempt.game.name)} · ${themes || 'Quiz set'}`,
        score: attempt.score,
        total: attempt.questionAttempts.length,
        date: formatFullDate(attempt.finishedAt),
      };
    });
  }

  private buildLessonsCompleted(
    attempts: ReadonlyArray<ThemeAttemptRecord>,
    catalog: ReadonlyArray<ContentGame>,
    totalLessons: number,
  ) {
    const groupedThemes = new Map<string, { total: number; correct: number }>();

    for (const attempt of attempts) {
      const key = `${toSharedGameName(attempt.question.theme.game.name)}:${attempt.question.theme.slug}`;
      const stats = groupedThemes.get(key) ?? { total: 0, correct: 0 };

      stats.total += 1;
      stats.correct += attempt.isCorrect ? 1 : 0;
      groupedThemes.set(key, stats);
    }

    const completed = catalog.reduce((total, game) => {
      return (
        total +
        game.themes.reduce((sum, theme) => {
          const stats = groupedThemes.get(`${game.game}:${theme.slug}`);
          const mastered = stats ? calculateAccuracy(stats.correct, stats.total) >= 70 : false;

          return sum + (mastered ? theme.lessons.length : 0);
        }, 0)
      );
    }, 0);

    return Math.min(totalLessons, completed);
  }

  private buildCurrentStreak(dailyUsage: ReadonlyArray<DailyUsageRecord>) {
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
}
