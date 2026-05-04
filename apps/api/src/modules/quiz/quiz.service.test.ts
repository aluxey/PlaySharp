import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BadRequestException } from '@nestjs/common';

import type { ContentService } from '../content/content.service';
import type { PrismaService } from '../prisma/prisma.service';
import { QuizService } from './quiz.service';

function createService(prisma: unknown) {
  return new QuizService({} as unknown as ContentService, prisma as PrismaService);
}

test('submitAttempt rejects duplicate questions', async () => {
  const service = createService({});

  await assert.rejects(
    () =>
      service.submitAttempt('user-1', {
        game: 'poker',
        answers: [
          {
            themeSlug: 'ranges',
            questionSlug: 'utg-open',
            selectedChoiceLabel: 'Raise',
          },
          {
            themeSlug: 'ranges',
            questionSlug: 'utg-open',
            selectedChoiceLabel: 'Fold',
          },
        ],
      }),
    BadRequestException,
  );
});

test('submitAttempt persists a multi-question attempt', async () => {
  let createdAttemptInput: unknown = null;
  const prisma = {
    game: {
      findUnique: async () => ({ id: 'game-1' }),
    },
    question: {
      findMany: async () => [
        {
          id: 'question-1',
          slug: 'utg-open',
          title: 'UTG open',
          explanation: 'Raise strong hands.',
          theme: { id: 'theme-1', slug: 'ranges', name: 'Ranges' },
          choices: [
            { id: 'choice-1', label: 'Fold', isCorrect: false },
            { id: 'choice-2', label: 'Raise', isCorrect: true },
          ],
        },
        {
          id: 'question-2',
          slug: 'button-open',
          title: 'Button open',
          explanation: 'Open wider on the button.',
          theme: { id: 'theme-1', slug: 'ranges', name: 'Ranges' },
          choices: [
            { id: 'choice-3', label: 'Fold', isCorrect: false },
            { id: 'choice-4', label: 'Raise', isCorrect: true },
          ],
        },
      ],
    },
    $transaction: async (
      callback: (tx: {
        quizAttempt: { create: (input: unknown) => Promise<unknown> };
        dailyUsage: { upsert: (input: unknown) => Promise<unknown> };
      }) => Promise<unknown>,
    ) =>
      callback({
        quizAttempt: {
          create: async (input: unknown) => {
            createdAttemptInput = input;
            return {
              id: 'attempt-1',
              startedAt: new Date('2026-05-04T10:00:00.000Z'),
              finishedAt: new Date('2026-05-04T10:01:00.000Z'),
              score: 1,
            };
          },
        },
        dailyUsage: {
          upsert: async () => ({}),
        },
      }),
  };
  const service = createService(prisma);
  const result = await service.submitAttempt('user-1', {
    game: 'poker',
    answers: [
      {
        themeSlug: 'ranges',
        questionSlug: 'utg-open',
        selectedChoiceLabel: 'Raise',
      },
      {
        themeSlug: 'ranges',
        questionSlug: 'button-open',
        selectedChoiceLabel: 'Fold',
      },
    ],
  });

  assert.equal(result.score, 1);
  assert.equal(result.totalQuestions, 2);
  assert.equal(result.answers[1]?.isCorrect, false);
  assert.match(JSON.stringify(createdAttemptInput), /questionAttempts/);
});
