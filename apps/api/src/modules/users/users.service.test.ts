import assert from 'node:assert/strict';
import { test } from 'node:test';

import { NotFoundException } from '@nestjs/common';

import type { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

function createService(prisma: unknown) {
  return new UsersService(prisma as PrismaService);
}

const lessonCompletionInput = {
  game: 'poker' as const,
  themeSlug: 'ranges',
  lessonSlug: 'opening-ranges',
};

test('getLessonCompletionStatus reports an incomplete lesson without creating a record', async () => {
  let completionLookup: unknown = null;
  const service = createService({
    lesson: {
      findFirst: async () => ({ id: 'lesson-1' }),
    },
    lessonCompletion: {
      findUnique: async (input: unknown) => {
        completionLookup = input;
        return null;
      },
    },
  });

  const result = await service.getLessonCompletionStatus('user-1', lessonCompletionInput);

  assert.equal(result.completed, false);
  assert.equal(result.completedAt, null);
  assert.match(JSON.stringify(completionLookup), /user-1/);
  assert.match(JSON.stringify(completionLookup), /lesson-1/);
});

test('completeLesson creates a stable lesson completion record', async () => {
  let upsertInput: unknown = null;
  const service = createService({
    lesson: {
      findFirst: async () => ({ id: 'lesson-1' }),
    },
    lessonCompletion: {
      upsert: async (input: unknown) => {
        upsertInput = input;
        return { completedAt: new Date('2026-05-04T10:00:00.000Z') };
      },
    },
  });

  const result = await service.completeLesson('user-1', lessonCompletionInput);

  assert.equal(result.completed, true);
  assert.equal(result.completedAt, '2026-05-04T10:00:00.000Z');
  assert.match(JSON.stringify(upsertInput), /userId_lessonId/);
  assert.match(JSON.stringify(upsertInput), /lesson-1/);
});

test('completeLesson rejects missing or archived lessons', async () => {
  const service = createService({
    lesson: {
      findFirst: async () => null,
    },
  });

  await assert.rejects(
    () => service.completeLesson('user-1', lessonCompletionInput),
    NotFoundException,
  );
});

test('getProfileOverview counts explicit lesson completions', async () => {
  const service = createService({
    user: {
      findUnique: async () => ({
        id: 'user-1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        plan: 'FREE',
        subscription: null,
      }),
    },
    lesson: {
      count: async () => 5,
    },
    quizAttempt: {
      count: async () => 0,
      findMany: async () => [],
    },
    questionAttempt: {
      count: async () => 0,
    },
    lessonCompletion: {
      count: async () => 2,
    },
    dailyUsage: {
      findMany: async () => [],
    },
  });

  const result = await service.getProfileOverview('user-1');
  const lessonsCompletedStat = result.stats.find((stat) => stat.key === 'lessonsCompleted');

  assert.equal(lessonsCompletedStat?.value, '2/5');
});
