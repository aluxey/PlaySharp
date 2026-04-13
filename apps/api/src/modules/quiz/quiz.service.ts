import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { type ContentGameName, type DailyQuiz, type QuizAttemptResult } from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { ContentService } from '../content/content.service';
import { PrismaService } from '../prisma/prisma.service';
import type { SubmitQuizAttemptDto } from './quiz.dto';

const PRISMA_GAME_NAMES = {
  poker: 'POKER',
  blackjack: 'BLACKJACK',
} as const;

type PersistedGameRecord = {
  id: string;
};

type PersistedQuestionChoice = {
  id: string;
  label: string;
  isCorrect: boolean;
};

type PersistedQuestionRecord = {
  id: string;
  slug: string;
  title: string;
  explanation: string;
  theme: {
    id: string;
    slug: string;
    name: string;
  };
  choices: ReadonlyArray<PersistedQuestionChoice>;
};

type EvaluatedAnswerRecord = {
  question: PersistedQuestionRecord;
  selectedChoice: PersistedQuestionChoice;
  correctChoice: PersistedQuestionChoice;
  responseTimeMs: number | undefined;
  isCorrect: boolean;
};

type CreatedAttemptRecord = {
  id: string;
  startedAt: Date;
  finishedAt: Date | null;
  score: number;
};

type QuizTransactionClient = {
  quizAttempt: {
    create(args: unknown): Promise<CreatedAttemptRecord>;
  };
  dailyUsage: {
    upsert(args: unknown): Promise<unknown>;
  };
};

function toPrismaGameName(game: ContentGameName) {
  return PRISMA_GAME_NAMES[game];
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

@Injectable()
export class QuizService {
  constructor(
    @Inject(ContentService) private readonly contentService: ContentService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getDailyQuiz(game: ContentGameName): Promise<DailyQuiz | null> {
    return this.contentService.getDailyQuiz(game);
  }

  async submitAttempt(userId: string, input: SubmitQuizAttemptDto): Promise<QuizAttemptResult> {
    if (input.answers.length === 0) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'QUIZ_ATTEMPT_EMPTY',
          'Quiz attempts must include at least one answer.',
        ),
      );
    }

    const uniqueAnswerKeys = new Set(
      input.answers.map((answer) => `${answer.themeSlug}:${answer.questionSlug}`),
    );

    if (uniqueAnswerKeys.size !== input.answers.length) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'QUIZ_INVALID_ATTEMPT',
          'Duplicate questions were submitted in the same attempt.',
        ),
      );
    }

    const game = (await this.prisma.game.findUnique({
      where: { name: toPrismaGameName(input.game) },
      select: { id: true },
    })) as PersistedGameRecord | null;

    if (!game) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'QUIZ_GAME_NOT_FOUND',
          `Missing seeded game for ${input.game}.`,
        ),
      );
    }

    const questions = (await this.prisma.question.findMany({
      where: {
        OR: input.answers.map((answer) => ({
          slug: answer.questionSlug,
          theme: {
            slug: answer.themeSlug,
            game: {
              name: toPrismaGameName(input.game),
            },
          },
        })),
      },
      include: {
        choices: {
          orderBy: { position: 'asc' },
        },
        theme: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    })) as ReadonlyArray<PersistedQuestionRecord>;
    const questionMap = new Map<string, PersistedQuestionRecord>(
      questions.map((question) => [`${question.theme.slug}:${question.slug}`, question]),
    );
    const evaluatedAnswers: ReadonlyArray<EvaluatedAnswerRecord> = input.answers.map((answer) => {
      const question = questionMap.get(`${answer.themeSlug}:${answer.questionSlug}`);

      if (!question) {
        throw new NotFoundException(
          createApiError(
            HttpStatus.NOT_FOUND,
            'QUIZ_QUESTION_NOT_FOUND',
            `Missing question ${answer.questionSlug} in theme ${answer.themeSlug}.`,
          ),
        );
      }

      const selectedChoice = question.choices.find(
        (choice) => choice.label === answer.selectedChoiceLabel,
      );

      if (!selectedChoice) {
        throw new BadRequestException(
          createApiError(
            HttpStatus.BAD_REQUEST,
            'QUIZ_CHOICE_NOT_FOUND',
            `Choice "${answer.selectedChoiceLabel}" does not exist for ${answer.questionSlug}.`,
          ),
        );
      }

      const correctChoice = question.choices.find((choice) => choice.isCorrect);

      if (!correctChoice) {
        throw new BadRequestException(
          createApiError(
            HttpStatus.BAD_REQUEST,
            'QUIZ_INVALID_ATTEMPT',
            `Question ${answer.questionSlug} is missing a correct choice.`,
          ),
        );
      }

      return {
        question,
        selectedChoice,
        correctChoice,
        responseTimeMs: answer.responseTimeMs,
        isCorrect: selectedChoice.isCorrect,
      };
    });

    const finishedAt = new Date();
    const totalResponseTime = evaluatedAnswers.reduce(
      (sum, answer) => sum + (answer.responseTimeMs ?? 0),
      0,
    );
    const startedAt = new Date(finishedAt.getTime() - totalResponseTime);
    const correctAnswers = evaluatedAnswers.filter((answer) => answer.isCorrect).length;
    const attempt = await this.prisma.$transaction(async (tx: unknown) => {
      const transactionClient = tx as QuizTransactionClient;
      const createdAttempt = await transactionClient.quizAttempt.create({
        data: {
          userId,
          gameId: game.id,
          startedAt,
          finishedAt,
          score: correctAnswers,
          questionAttempts: {
            create: evaluatedAnswers.map((answer) => ({
              question: {
                connect: {
                  id: answer.question.id,
                },
              },
              selectedChoice: {
                connect: {
                  id: answer.selectedChoice.id,
                },
              },
              isCorrect: answer.isCorrect,
              ...(answer.responseTimeMs !== undefined
                ? {
                    responseTime: answer.responseTimeMs,
                  }
                : {}),
              ...(!answer.isCorrect
                ? {
                    errorTheme: {
                      connect: {
                        id: answer.question.theme.id,
                      },
                    },
                  }
                : {}),
            })),
          },
        },
        select: {
          id: true,
          startedAt: true,
          finishedAt: true,
          score: true,
        },
      });

      await transactionClient.dailyUsage.upsert({
        where: {
          userId_date: {
            userId,
            date: startOfUtcDay(finishedAt),
          },
        },
        update: {
          questionsAnswered: {
            increment: evaluatedAnswers.length,
          },
        },
        create: {
          userId,
          date: startOfUtcDay(finishedAt),
          questionsAnswered: evaluatedAnswers.length,
        },
      });

      return createdAttempt;
    });

    return {
      id: attempt.id,
      game: input.game,
      score: attempt.score,
      totalQuestions: evaluatedAnswers.length,
      correctAnswers,
      startedAt: attempt.startedAt.toISOString(),
      finishedAt: attempt.finishedAt?.toISOString() ?? finishedAt.toISOString(),
      answers: evaluatedAnswers.map((answer) => ({
        themeSlug: answer.question.theme.slug,
        themeName: answer.question.theme.name,
        questionSlug: answer.question.slug,
        questionTitle: answer.question.title,
        selectedChoiceLabel: answer.selectedChoice.label,
        correctChoiceLabel: answer.correctChoice.label,
        isCorrect: answer.isCorrect,
        explanation: answer.question.explanation,
      })),
    };
  }
}
