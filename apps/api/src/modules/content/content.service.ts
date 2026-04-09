import { Injectable } from '@nestjs/common';

import {
  type ContentCatalog,
  type ContentGame,
  type ContentGameName,
  type ContentLesson,
  type ContentQuestion,
  type ContentGameSummary as SharedContentGameSummary,
  type ContentTheme,
  type DailyQuiz,
} from '@playsharp/shared';

import {
  findTheme,
  loadContentCatalog,
  loadGameContent,
  summarizeGameContent,
} from './content.loader';

export type ContentGameSummary = SharedContentGameSummary;

@Injectable()
export class ContentService {
  async getCatalog(): Promise<ContentCatalog> {
    return loadContentCatalog();
  }

  async listGameSummaries(): Promise<ContentGameSummary[]> {
    const catalog = await this.getCatalog();
    return catalog.map((entry) => summarizeGameContent(entry));
  }

  async getGame(game: ContentGameName): Promise<ContentGame | null> {
    return loadGameContent(game);
  }

  async getThemes(game: ContentGameName): Promise<ReadonlyArray<ContentTheme>> {
    const gameContent = await this.getGame(game);
    return gameContent?.themes ?? [];
  }

  async getTheme(game: ContentGameName, themeSlug: string): Promise<ContentTheme | null> {
    const gameContent = await this.getGame(game);
    if (!gameContent) {
      return null;
    }

    return findTheme(gameContent, themeSlug);
  }

  async getLessons(
    game: ContentGameName,
    themeSlug: string,
  ): Promise<ReadonlyArray<ContentLesson>> {
    const theme = await this.getTheme(game, themeSlug);
    return theme?.lessons ?? [];
  }

  async getQuestions(
    game: ContentGameName,
    themeSlug: string,
  ): Promise<ReadonlyArray<ContentQuestion>> {
    const theme = await this.getTheme(game, themeSlug);
    return theme?.questions ?? [];
  }

  async getDailyQuiz(game: ContentGameName): Promise<DailyQuiz | null> {
    const gameContent = await this.getGame(game);
    if (!gameContent) {
      return null;
    }

    const theme = gameContent.themes.find((candidate) => candidate.questions.length > 0);
    if (!theme) {
      return null;
    }

    const question = theme.questions[0];
    if (!question) {
      return null;
    }

    return {
      game: gameContent.game,
      themeSlug: theme.slug,
      themeName: theme.name,
      question,
    };
  }
}
