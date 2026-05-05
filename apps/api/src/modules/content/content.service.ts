import { HttpStatus, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';

import {
  type ContentCatalog,
  type ContentDifficulty,
  type ContentGame,
  type ContentGameName,
  type ContentLesson,
  type ContentQuestion,
  type ContentGameSummary as SharedContentGameSummary,
  type ContentTheme,
  type DailyQuiz,
  type DailyQuizQuestion,
} from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import { findTheme, summarizeGameContent, validateContentGame } from './content.loader';

export type ContentGameSummary = SharedContentGameSummary;

const CONTENT_SYNC_SOURCE = 'content-json';

const SHARED_GAME_NAMES = {
  POKER: 'poker',
  BLACKJACK: 'blackjack',
} as const;

const SHARED_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

type PrismaGameName = keyof typeof SHARED_GAME_NAMES;
type PrismaDifficulty = keyof typeof SHARED_DIFFICULTY;

type ContentSyncRecord = {
  source: string;
  version: string;
  syncedAt: Date;
};

type GameRecord = {
  name: PrismaGameName;
  themes: ReadonlyArray<{
    slug: string;
    name: string;
    level: PrismaDifficulty;
    lessons: ReadonlyArray<{
      slug: string;
      title: string;
      content: string;
      level: PrismaDifficulty;
    }>;
    questions: ReadonlyArray<{
      slug: string;
      title: string;
      scenario: string | null;
      difficulty: PrismaDifficulty;
      explanation: string;
      isPremium: boolean;
      choices: ReadonlyArray<{
        label: string;
        isCorrect: boolean;
        explanation: string | null;
      }>;
    }>;
  }>;
};

function toSharedGameName(game: PrismaGameName): ContentGameName {
  return SHARED_GAME_NAMES[game];
}

function toSharedDifficulty(level: PrismaDifficulty): ContentDifficulty {
  return SHARED_DIFFICULTY[level];
}

@Injectable()
export class ContentService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getCatalog(): Promise<ContentCatalog> {
    await this.requireContentSync();

    const games = (await this.prisma.game.findMany({
      orderBy: { name: 'asc' },
      include: {
        themes: {
          orderBy: { slug: 'asc' },
          include: {
            lessons: {
              where: { archivedAt: null },
              orderBy: { slug: 'asc' },
            },
            questions: {
              where: { archivedAt: null },
              orderBy: { slug: 'asc' },
              include: {
                choices: {
                  orderBy: { position: 'asc' },
                },
              },
            },
          },
        },
      },
    })) as ReadonlyArray<GameRecord>;
    const catalog = games.map((game) => this.toContentGame(game));

    this.validateRuntimeCatalog(catalog);

    return catalog;
  }

  async listGameSummaries(): Promise<ContentGameSummary[]> {
    const catalog = await this.getCatalog();
    return catalog.map((entry) => summarizeGameContent(entry));
  }

  async getGame(game: ContentGameName): Promise<ContentGame | null> {
    const catalog = await this.getCatalog();
    return catalog.find((entry) => entry.game === game) ?? null;
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

    const questions: DailyQuizQuestion[] = gameContent.themes
      .flatMap((theme) =>
        theme.questions.map((question) => ({
          themeSlug: theme.slug,
          themeName: theme.name,
          question,
        })),
      )
      .slice(0, 5);
    const firstQuestion = questions[0];

    if (!firstQuestion) {
      return null;
    }

    return {
      game: gameContent.game,
      questions,
      themeSlug: firstQuestion.themeSlug,
      themeName: firstQuestion.themeName,
      question: firstQuestion.question,
    };
  }

  private async requireContentSync(): Promise<ContentSyncRecord> {
    const contentSync = (await this.prisma.contentSync.findUnique({
      where: { source: CONTENT_SYNC_SOURCE },
      select: {
        source: true,
        version: true,
        syncedAt: true,
      },
    })) as ContentSyncRecord | null;

    if (!contentSync) {
      throw new ServiceUnavailableException(
        createApiError(
          HttpStatus.SERVICE_UNAVAILABLE,
          'CONTENT_SOURCE_UNAVAILABLE',
          'Content database has not been seeded. Run the content seed before serving public content.',
        ),
      );
    }

    return contentSync;
  }

  private validateRuntimeCatalog(catalog: ContentCatalog) {
    if (catalog.length === 0) {
      throw new ServiceUnavailableException(
        createApiError(
          HttpStatus.SERVICE_UNAVAILABLE,
          'CONTENT_SOURCE_UNAVAILABLE',
          'Content database is empty. Run the content seed before serving public content.',
        ),
      );
    }

    try {
      for (const game of catalog) {
        validateContentGame(game, game.game);
      }
    } catch (error) {
      throw new ServiceUnavailableException(
        createApiError(
          HttpStatus.SERVICE_UNAVAILABLE,
          'CONTENT_DRIFT_DETECTED',
          error instanceof Error
            ? `Content database is inconsistent: ${error.message}`
            : 'Content database is inconsistent.',
        ),
      );
    }
  }

  private toContentGame(game: GameRecord): ContentGame {
    const sharedGame = toSharedGameName(game.name);

    return {
      game: sharedGame,
      name: sharedGame === 'blackjack' ? 'Blackjack' : 'Poker',
      themes: game.themes.map((theme) => ({
        slug: theme.slug,
        name: theme.name,
        level: toSharedDifficulty(theme.level),
        lessons: theme.lessons.map((lesson) => ({
          slug: lesson.slug,
          title: lesson.title,
          content: lesson.content,
          level: toSharedDifficulty(lesson.level),
        })),
        questions: theme.questions.map((question) => ({
          slug: question.slug,
          title: question.title,
          ...(question.scenario ? { scenario: question.scenario } : {}),
          difficulty: toSharedDifficulty(question.difficulty),
          explanation: question.explanation,
          isPremium: question.isPremium,
          choices: question.choices.map((choice) => ({
            label: choice.label,
            isCorrect: choice.isCorrect,
            ...(choice.explanation ? { explanation: choice.explanation } : {}),
          })),
        })),
      })),
    };
  }
}
