import { Inject, Injectable } from '@nestjs/common';

import type {
  ContentGame,
  ProgressOverview,
  ProgressThemeInsight,
  ProgressTrendPoint,
  RecurringMistake,
} from '@playsharp/shared';

import { ContentService } from '../content/content.service';

const weeklyTrendTemplate = [-6, -4, -2, -1, 1, 3, 0] as const;
const weeklyTrendDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

@Injectable()
export class ProgressService {
  constructor(@Inject(ContentService) private readonly contentService: ContentService) {}

  async getOverview(): Promise<ProgressOverview> {
    const catalog = await this.contentService.getCatalog();
    const totalLessons = catalog.reduce(
      (total, game) => total + game.themes.reduce((sum, theme) => sum + theme.lessons.length, 0),
      0,
    );
    const themeInsights = this.buildThemeInsights(catalog);
    const weakestTheme =
      [...themeInsights].sort((left, right) => left.accuracy - right.accuracy)[0] ?? null;
    const overallAccuracy = this.averageAccuracy(themeInsights);
    const lessonsCompleted =
      totalLessons === 0
        ? 0
        : Math.min(totalLessons, Math.max(1, Math.floor(totalLessons * 0.625)));
    const questionsAnswered = catalog.reduce(
      (total, game) =>
        total + game.themes.reduce((sum, theme) => sum + theme.questions.length * 18, 0),
      totalLessons * 6,
    );

    return {
      summary: {
        overallAccuracy,
        questionsAnswered,
        currentStreak: 7,
        lessonsCompleted,
        totalLessons,
        weeklyChange: 4,
      },
      weeklyAccuracy: this.buildWeeklyTrend(overallAccuracy),
      themesToImprove: [...themeInsights].sort((left, right) => left.accuracy - right.accuracy),
      recurringMistakes: this.buildRecurringMistakes(catalog),
      recommendation:
        weakestTheme === null
          ? null
          : {
              title: `Revisit ${weakestTheme.themeName}`,
              description: `Accuracy is trailing in ${weakestTheme.themeName}. A short lesson review plus a fresh quiz set is the next highest-leverage move.`,
              actionLabel: 'Open lessons',
              href: '/lessons',
            },
    };
  }

  private averageAccuracy(themes: ReadonlyArray<ProgressThemeInsight>) {
    if (themes.length === 0) {
      return 0;
    }

    const total = themes.reduce((sum, theme) => sum + theme.accuracy, 0);
    return Math.round(total / themes.length);
  }

  private buildWeeklyTrend(overallAccuracy: number): ReadonlyArray<ProgressTrendPoint> {
    return weeklyTrendDays.map((day, index) => {
      const delta = weeklyTrendTemplate[index] ?? 0;

      return {
        day,
        accuracy: Math.max(48, Math.min(98, overallAccuracy + delta)),
      };
    });
  }

  private buildThemeInsights(
    catalog: ReadonlyArray<ContentGame>,
  ): ReadonlyArray<ProgressThemeInsight> {
    return catalog.flatMap((game, gameIndex) =>
      game.themes.map((theme, themeIndex) => {
        const index = gameIndex * 3 + themeIndex;

        return {
          game: game.game,
          themeSlug: theme.slug,
          themeName: theme.name,
          accuracy: 63 + (index % 4) * 5,
          questionCount: theme.questions.length * 9 + theme.lessons.length * 3,
          improvement: [-3, 5, 2, -1][index % 4] ?? 0,
        };
      }),
    );
  }

  private buildRecurringMistakes(
    catalog: ReadonlyArray<ContentGame>,
  ): ReadonlyArray<RecurringMistake> {
    const mistakes = catalog.flatMap((game, gameIndex) =>
      game.themes.flatMap((theme, themeIndex) =>
        theme.questions.slice(0, 2).map((question, questionIndex) => ({
          questionSlug: question.slug,
          themeName: theme.name,
          label: question.title,
          occurrences: 6 - Math.min(gameIndex + themeIndex + questionIndex, 4),
          lastSeen: ['Apr 8, 2026', 'Apr 7, 2026', 'Apr 5, 2026'][questionIndex] ?? 'Apr 4, 2026',
        })),
      ),
    );

    return mistakes.slice(0, 4);
  }
}
