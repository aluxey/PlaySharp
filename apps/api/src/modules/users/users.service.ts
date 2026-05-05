import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';

import type {
  ContentGameName,
  LessonCompletionStatus,
  ProfileOverview,
  ProfileQuizScore,
  ProfileStat,
} from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import type { LessonCompletionDto } from './users.dto';

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

type DailyUsageRecord = {
  date: Date;
  questionsAnswered: number;
};

type LessonCompletionRecord = {
  completedAt: Date;
};

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getProfileOverview(userId: string): Promise<ProfileOverview> {
    const [user, totalLessons] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: true,
        },
      }),
      this.prisma.lesson.count({
        where: { archivedAt: null },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(
        createApiError(HttpStatus.NOT_FOUND, 'AUTH_USER_NOT_FOUND', `Missing user: ${userId}`),
      );
    }

    const [
      quizzesCompleted,
      totalQuestionAttempts,
      correctQuestionAttempts,
      recentAttempts,
      lessonsCompleted,
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
      this.prisma.lessonCompletion.count({
        where: {
          userId,
          lesson: {
            archivedAt: null,
          },
        },
      }),
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

  async getLessonCompletionStatus(
    userId: string,
    input: LessonCompletionDto,
  ): Promise<LessonCompletionStatus> {
    const lesson = await this.requireLesson(input);
    const completion = (await this.prisma.lessonCompletion.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
      select: {
        completedAt: true,
      },
    })) as LessonCompletionRecord | null;

    return {
      game: input.game,
      themeSlug: input.themeSlug,
      lessonSlug: input.lessonSlug,
      completed: completion !== null,
      completedAt: completion?.completedAt.toISOString() ?? null,
    };
  }

  async completeLesson(
    userId: string,
    input: LessonCompletionDto,
  ): Promise<LessonCompletionStatus> {
    const lesson = await this.requireLesson(input);
    const completion = (await this.prisma.lessonCompletion.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
      update: {},
      create: {
        userId,
        lessonId: lesson.id,
      },
      select: {
        completedAt: true,
      },
    })) as LessonCompletionRecord;

    return {
      game: input.game,
      themeSlug: input.themeSlug,
      lessonSlug: input.lessonSlug,
      completed: true,
      completedAt: completion.completedAt.toISOString(),
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

  private async requireLesson(input: LessonCompletionDto) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        slug: input.lessonSlug,
        archivedAt: null,
        theme: {
          slug: input.themeSlug,
          game: {
            name: input.game === 'blackjack' ? 'BLACKJACK' : 'POKER',
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'LESSON_COMPLETION_NOT_FOUND',
          `Lesson ${input.game}/${input.themeSlug}/${input.lessonSlug} was not found.`,
        ),
      );
    }

    return lesson;
  }
}
