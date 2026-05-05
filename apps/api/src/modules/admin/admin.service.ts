import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type {
  ContentCatalog,
  AdminLessonRecord,
  AdminOverview,
  AdminQuestionRecord,
  AdminThemeRecord,
  ContentDifficulty,
  ContentGameName,
} from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import type { AdminLessonMutationDto, AdminQuestionMutationDto } from './admin.dto';

const PRISMA_GAME_NAMES = {
  poker: 'POKER',
  blackjack: 'BLACKJACK',
} as const;

const SHARED_GAME_NAMES = {
  POKER: 'poker',
  BLACKJACK: 'blackjack',
} as const;

const PRISMA_DIFFICULTY = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
} as const;

const SHARED_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

type PrismaGameName = keyof typeof SHARED_GAME_NAMES;
type PrismaDifficulty = keyof typeof SHARED_DIFFICULTY;

type ThemeRecord = {
  id: string;
  slug: string;
  name: string;
  level: PrismaDifficulty;
  game: {
    name: PrismaGameName;
  };
  lessons: ReadonlyArray<unknown>;
  questions: ReadonlyArray<unknown>;
};

type LessonRecord = {
  id: string;
  slug: string;
  title: string;
  content: string;
  level: PrismaDifficulty;
  archivedAt: Date | null;
  theme: {
    slug: string;
    game: {
      name: PrismaGameName;
    };
  };
};

type QuestionRecord = {
  id: string;
  slug: string;
  title: string;
  scenario: string | null;
  difficulty: PrismaDifficulty;
  explanation: string;
  isPremium: boolean;
  archivedAt: Date | null;
  theme: {
    slug: string;
    game: {
      name: PrismaGameName;
    };
  };
  choices: ReadonlyArray<{
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string | null;
  }>;
};

type ContentSyncRecord = {
  version: string;
  syncedAt: Date;
};

function toPrismaGameName(game: ContentGameName) {
  return PRISMA_GAME_NAMES[game];
}

function toSharedGameName(game: PrismaGameName): ContentGameName {
  return SHARED_GAME_NAMES[game];
}

function toPrismaDifficulty(level: ContentDifficulty) {
  return PRISMA_DIFFICULTY[level];
}

function toSharedDifficulty(level: PrismaDifficulty): ContentDifficulty {
  return SHARED_DIFFICULTY[level];
}

function ensureValidChoices(input: AdminQuestionMutationDto) {
  const correctChoices = input.choices.filter((choice) => choice.isCorrect);
  const duplicateLabels = new Set<string>();
  const labels = new Set<string>();

  for (const choice of input.choices) {
    const key = choice.label.trim().toLowerCase();
    if (labels.has(key)) {
      duplicateLabels.add(choice.label);
    }

    labels.add(key);
  }

  if (correctChoices.length !== 1 || duplicateLabels.size > 0) {
    throw new BadRequestException(
      createApiError(
        HttpStatus.BAD_REQUEST,
        'ADMIN_INVALID_CONTENT',
        duplicateLabels.size > 0
          ? `Question choices must have unique labels: ${[...duplicateLabels].join(', ')}.`
          : 'Questions must have exactly one correct choice.',
      ),
    );
  }
}

@Injectable()
export class AdminService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getOverview(): Promise<AdminOverview> {
    const [games, contentSync] = await Promise.all([
      this.prisma.game.findMany({
        orderBy: { name: 'asc' },
        include: {
          themes: {
            include: {
              lessons: {
                where: { archivedAt: null },
              },
              questions: {
                where: { archivedAt: null },
              },
            },
          },
        },
      }),
      this.prisma.contentSync.findUnique({
        where: { source: 'content-json' },
        select: {
          version: true,
          syncedAt: true,
        },
      }) as Promise<ContentSyncRecord | null>,
    ]);
    const sources = games.map((game) => ({
      game: toSharedGameName(game.name as PrismaGameName),
      name: toSharedGameName(game.name as PrismaGameName) === 'blackjack' ? 'Blackjack' : 'Poker',
      path: contentSync
        ? `postgresql://content?version=${contentSync.version}`
        : 'postgresql://content',
      updatedAt: (contentSync?.syncedAt ?? new Date(0)).toISOString(),
      themeCount: game.themes.length,
      lessonCount: game.themes.reduce((sum, theme) => sum + theme.lessons.length, 0),
      questionCount: game.themes.reduce((sum, theme) => sum + theme.questions.length, 0),
    }));

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
    const themes = (await this.prisma.theme.findMany({
      orderBy: [{ game: { name: 'asc' } }, { slug: 'asc' }],
      include: {
        game: true,
        lessons: {
          where: { archivedAt: null },
        },
        questions: {
          where: { archivedAt: null },
        },
      },
    })) as ReadonlyArray<ThemeRecord>;

    return themes.map((theme) => ({
      game: toSharedGameName(theme.game.name),
      themeSlug: theme.slug,
      themeName: theme.name,
      level: toSharedDifficulty(theme.level),
      lessonCount: theme.lessons.length,
      questionCount: theme.questions.length,
    }));
  }

  async listLessons(): Promise<ReadonlyArray<AdminLessonRecord>> {
    const lessons = (await this.prisma.lesson.findMany({
      orderBy: [{ theme: { game: { name: 'asc' } } }, { archivedAt: 'asc' }, { slug: 'asc' }],
      include: {
        theme: {
          include: {
            game: true,
          },
        },
      },
    })) as ReadonlyArray<LessonRecord>;

    return lessons.map((lesson) => this.toLessonRecord(lesson));
  }

  async createLesson(input: AdminLessonMutationDto): Promise<AdminLessonRecord> {
    const theme = await this.requireTheme(input.game, input.themeSlug);
    const lesson = (await this.prisma.lesson.create({
      data: {
        themeId: theme.id,
        slug: input.lessonSlug,
        title: input.title,
        content: input.content,
        level: toPrismaDifficulty(input.level),
      },
      include: {
        theme: {
          include: {
            game: true,
          },
        },
      },
    })) as LessonRecord;

    return this.toLessonRecord(lesson);
  }

  async updateLesson(id: string, input: AdminLessonMutationDto): Promise<AdminLessonRecord> {
    await this.requireLesson(id);
    const theme = await this.requireTheme(input.game, input.themeSlug);
    const lesson = (await this.prisma.lesson.update({
      where: { id },
      data: {
        themeId: theme.id,
        slug: input.lessonSlug,
        title: input.title,
        content: input.content,
        level: toPrismaDifficulty(input.level),
        archivedAt: null,
      },
      include: {
        theme: {
          include: {
            game: true,
          },
        },
      },
    })) as LessonRecord;

    return this.toLessonRecord(lesson);
  }

  async archiveLesson(id: string): Promise<AdminLessonRecord> {
    await this.requireLesson(id);
    const lesson = (await this.prisma.lesson.update({
      where: { id },
      data: { archivedAt: new Date() },
      include: {
        theme: {
          include: {
            game: true,
          },
        },
      },
    })) as LessonRecord;

    return this.toLessonRecord(lesson);
  }

  async listQuestions(): Promise<ReadonlyArray<AdminQuestionRecord>> {
    const questions = (await this.prisma.question.findMany({
      orderBy: [{ theme: { game: { name: 'asc' } } }, { archivedAt: 'asc' }, { slug: 'asc' }],
      include: {
        theme: {
          include: {
            game: true,
          },
        },
        choices: {
          orderBy: { position: 'asc' },
        },
      },
    })) as ReadonlyArray<QuestionRecord>;

    return questions.map((question) => this.toQuestionRecord(question));
  }

  async exportCatalog(): Promise<ContentCatalog> {
    const games = await this.prisma.game.findMany({
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
    });

    return games.map((game) => ({
      game: toSharedGameName(game.name as PrismaGameName),
      name: toSharedGameName(game.name as PrismaGameName) === 'blackjack' ? 'Blackjack' : 'Poker',
      themes: game.themes.map((theme) => ({
        slug: theme.slug,
        name: theme.name,
        level: toSharedDifficulty(theme.level as PrismaDifficulty),
        lessons: theme.lessons.map((lesson) => ({
          slug: lesson.slug,
          title: lesson.title,
          content: lesson.content,
          level: toSharedDifficulty(lesson.level as PrismaDifficulty),
        })),
        questions: theme.questions.map((question) => ({
          slug: question.slug,
          title: question.title,
          ...(question.scenario ? { scenario: question.scenario } : {}),
          difficulty: toSharedDifficulty(question.difficulty as PrismaDifficulty),
          explanation: question.explanation,
          isPremium: question.isPremium,
          choices: question.choices.map((choice) => ({
            label: choice.label,
            isCorrect: choice.isCorrect,
            ...(choice.explanation ? { explanation: choice.explanation } : {}),
          })),
        })),
      })),
    }));
  }

  async createQuestion(input: AdminQuestionMutationDto): Promise<AdminQuestionRecord> {
    ensureValidChoices(input);

    const theme = await this.requireTheme(input.game, input.themeSlug);
    const question = (await this.prisma.question.create({
      data: {
        themeId: theme.id,
        slug: input.questionSlug,
        title: input.title,
        scenario: input.scenario || null,
        difficulty: toPrismaDifficulty(input.difficulty),
        explanation: input.explanation,
        isPremium: input.isPremium,
        choices: {
          create: input.choices.map((choice, position) => ({
            position,
            label: choice.label,
            isCorrect: choice.isCorrect,
            explanation: choice.explanation || null,
          })),
        },
      },
      include: this.questionInclude,
    })) as QuestionRecord;

    return this.toQuestionRecord(question);
  }

  async updateQuestion(id: string, input: AdminQuestionMutationDto): Promise<AdminQuestionRecord> {
    ensureValidChoices(input);

    await this.requireQuestion(id);
    const theme = await this.requireTheme(input.game, input.themeSlug);
    const question = (await this.prisma.$transaction(async (tx) => {
      await tx.questionChoice.deleteMany({ where: { questionId: id } });

      return tx.question.update({
        where: { id },
        data: {
          themeId: theme.id,
          slug: input.questionSlug,
          title: input.title,
          scenario: input.scenario || null,
          difficulty: toPrismaDifficulty(input.difficulty),
          explanation: input.explanation,
          isPremium: input.isPremium,
          archivedAt: null,
          choices: {
            create: input.choices.map((choice, position) => ({
              position,
              label: choice.label,
              isCorrect: choice.isCorrect,
              explanation: choice.explanation || null,
            })),
          },
        },
        include: this.questionInclude,
      });
    })) as QuestionRecord;

    return this.toQuestionRecord(question);
  }

  async archiveQuestion(id: string): Promise<AdminQuestionRecord> {
    await this.requireQuestion(id);
    const question = (await this.prisma.question.update({
      where: { id },
      data: { archivedAt: new Date() },
      include: this.questionInclude,
    })) as QuestionRecord;

    return this.toQuestionRecord(question);
  }

  private readonly questionInclude = {
    theme: {
      include: {
        game: true,
      },
    },
    choices: {
      orderBy: { position: 'asc' as const },
    },
  };

  private async requireTheme(game: ContentGameName, themeSlug: string) {
    const theme = await this.prisma.theme.findUnique({
      where: {
        gameId_slug: {
          gameId: await this.requireGameId(game),
          slug: themeSlug,
        },
      },
      select: {
        id: true,
      },
    });

    if (!theme) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'ADMIN_THEME_NOT_FOUND',
          `Theme ${game}/${themeSlug} was not found.`,
        ),
      );
    }

    return theme;
  }

  private async requireGameId(game: ContentGameName) {
    const gameRecord = await this.prisma.game.findUnique({
      where: { name: toPrismaGameName(game) },
      select: { id: true },
    });

    if (!gameRecord) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'ADMIN_THEME_NOT_FOUND',
          `Game ${game} was not found.`,
        ),
      );
    }

    return gameRecord.id;
  }

  private async requireLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id }, select: { id: true } });

    if (!lesson) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'ADMIN_RECORD_NOT_FOUND',
          `Lesson ${id} was not found.`,
        ),
      );
    }
  }

  private async requireQuestion(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id }, select: { id: true } });

    if (!question) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'ADMIN_RECORD_NOT_FOUND',
          `Question ${id} was not found.`,
        ),
      );
    }
  }

  private toLessonRecord(lesson: LessonRecord): AdminLessonRecord {
    return {
      id: lesson.id,
      game: toSharedGameName(lesson.theme.game.name),
      themeSlug: lesson.theme.slug,
      lessonSlug: lesson.slug,
      title: lesson.title,
      content: lesson.content,
      level: toSharedDifficulty(lesson.level),
      archivedAt: lesson.archivedAt?.toISOString() ?? null,
    };
  }

  private toQuestionRecord(question: QuestionRecord): AdminQuestionRecord {
    return {
      id: question.id,
      game: toSharedGameName(question.theme.game.name),
      themeSlug: question.theme.slug,
      questionSlug: question.slug,
      title: question.title,
      scenario: question.scenario,
      difficulty: toSharedDifficulty(question.difficulty),
      explanation: question.explanation,
      isPremium: question.isPremium,
      choiceCount: question.choices.length,
      choices: question.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        isCorrect: choice.isCorrect,
        explanation: choice.explanation,
      })),
      archivedAt: question.archivedAt?.toISOString() ?? null,
    };
  }
}
