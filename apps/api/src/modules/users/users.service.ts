import { Inject, Injectable } from '@nestjs/common';

import type { ContentGame, ProfileOverview, ProfileQuizScore, ProfileStat } from '@playsharp/shared';

import { ContentService } from '../content/content.service';

@Injectable()
export class UsersService {
  constructor(@Inject(ContentService) private readonly contentService: ContentService) {}

  async getProfileOverview(): Promise<ProfileOverview> {
    const catalog = await this.contentService.getCatalog();
    const questions = catalog.flatMap((game) =>
      game.themes.flatMap((theme) =>
        theme.questions.map((question) => ({
          game: game.name,
          theme: theme.name,
          title: question.title,
        })),
      ),
    );
    const totalLessons = catalog.reduce(
      (total, game) => total + game.themes.reduce((sum, theme) => sum + theme.lessons.length, 0),
      0,
    );
    const stats = this.buildStats(catalog, totalLessons);

    return {
      user: {
        name: 'Alex Parker',
        initials: 'AP',
        email: 'alex.parker@email.com',
        memberSince: '2026-01-15',
        memberSinceLabel: 'January 15, 2026',
        plan: 'premium',
        planLabel: 'Premium Member',
        renewalDate: 'May 15, 2026',
      },
      stats,
      recentQuizScores: this.buildRecentQuizScores(questions),
      achievements: [
        { icon: '🔥', name: 'Week Streak', unlocked: true },
        { icon: '🎯', name: 'Perfect Round', unlocked: true },
        { icon: '📚', name: 'Lesson Finisher', unlocked: totalLessons >= 6 },
        { icon: '⚡', name: 'Quiz Volume', unlocked: true },
        { icon: '🏆', name: 'Advanced Table', unlocked: catalog.some((game) => game.themes.length >= 2) },
        { icon: '💎', name: 'Elite Accuracy', unlocked: false },
      ],
    };
  }

  private buildStats(catalog: ReadonlyArray<ContentGame>, totalLessons: number): ReadonlyArray<ProfileStat> {
    const themeCount = catalog.reduce((total, game) => total + game.themes.length, 0);
    const overallAccuracy = 63 + themeCount * 4;
    const quizzesCompleted = catalog.reduce(
      (total, game) => total + game.themes.reduce((sum, theme) => sum + theme.questions.length * 7, 0),
      0,
    );

    return [
      {
        key: 'overallAccuracy',
        label: 'Overall Accuracy',
        value: `${overallAccuracy}%`,
      },
      {
        key: 'quizzesCompleted',
        label: 'Quizzes Completed',
        value: `${quizzesCompleted}`,
      },
      {
        key: 'lessonsCompleted',
        label: 'Lessons Completed',
        value: `${Math.min(totalLessons, Math.max(1, Math.floor(totalLessons * 0.625)))}/${totalLessons}`,
      },
      {
        key: 'currentStreak',
        label: 'Current Streak',
        value: '7 days',
      },
    ];
  }

  private buildRecentQuizScores(
    questions: ReadonlyArray<{ game: string; theme: string; title: string }>,
  ): ReadonlyArray<ProfileQuizScore> {
    const dates = ['Apr 8, 2026', 'Apr 7, 2026', 'Apr 6, 2026', 'Apr 4, 2026'] as const;

    return questions.slice(0, 4).map((question, index) => ({
      name: `${question.game} · ${question.theme}`,
      score: 8 - (index % 3),
      total: 10,
      date: dates[index] ?? 'Apr 3, 2026',
    }));
  }
}
