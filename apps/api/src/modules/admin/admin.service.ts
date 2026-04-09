import { Inject, Injectable } from '@nestjs/common';

import type {
  AdminLessonRecord,
  AdminOverview,
  AdminQuestionRecord,
  AdminThemeRecord,
} from '@playsharp/shared';

import { listContentSources, summarizeGameContent } from '../content/content.loader';
import { ContentService } from '../content/content.service';

@Injectable()
export class AdminService {
  constructor(@Inject(ContentService) private readonly contentService: ContentService) {}

  async getOverview(): Promise<AdminOverview> {
    const catalog = await this.contentService.getCatalog();
    const fileSources = await listContentSources();
    const sources = catalog.map((gameContent) => {
      const summary = summarizeGameContent(gameContent);
      const source = fileSources.find((entry) => entry.game === gameContent.game);

      return {
        game: gameContent.game,
        name: gameContent.name,
        path: source?.path ?? `content/${gameContent.game}/content.json`,
        updatedAt: source?.updatedAt ?? new Date(0).toISOString(),
        themeCount: summary.themeCount,
        lessonCount: summary.lessonCount,
        questionCount: summary.questionCount,
      };
    });

    return {
      sources,
      totals: {
        games: sources.length,
        themes: sources.reduce((sum, source) => sum + source.themeCount, 0),
        lessons: sources.reduce((sum, source) => sum + source.lessonCount, 0),
        questions: sources.reduce((sum, source) => sum + source.questionCount, 0),
      },
    };
  }

  async listThemes(): Promise<ReadonlyArray<AdminThemeRecord>> {
    const catalog = await this.contentService.getCatalog();

    return catalog.flatMap((game) =>
      game.themes.map((theme) => ({
        game: game.game,
        themeSlug: theme.slug,
        themeName: theme.name,
        level: theme.level,
        lessonCount: theme.lessons.length,
        questionCount: theme.questions.length,
      })),
    );
  }

  async listLessons(): Promise<ReadonlyArray<AdminLessonRecord>> {
    const catalog = await this.contentService.getCatalog();

    return catalog.flatMap((game) =>
      game.themes.flatMap((theme) =>
        theme.lessons.map((lesson) => ({
          game: game.game,
          themeSlug: theme.slug,
          lessonSlug: lesson.slug,
          title: lesson.title,
          level: lesson.level,
        })),
      ),
    );
  }

  async listQuestions(): Promise<ReadonlyArray<AdminQuestionRecord>> {
    const catalog = await this.contentService.getCatalog();

    return catalog.flatMap((game) =>
      game.themes.flatMap((theme) =>
        theme.questions.map((question) => ({
          game: game.game,
          themeSlug: theme.slug,
          questionSlug: question.slug,
          title: question.title,
          difficulty: question.difficulty,
          isPremium: question.isPremium,
          choiceCount: question.choices.length,
        })),
      ),
    );
  }
}
