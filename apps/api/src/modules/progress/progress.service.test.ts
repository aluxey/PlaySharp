import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from './progress.service';

function createService(prisma: unknown) {
  return new ProgressService(prisma as PrismaService);
}

test('getOverview reports zero completed lessons when no completion records exist', async () => {
  const service = createService({
    questionAttempt: {
      findMany: async () => [],
      count: async () => 0,
    },
    dailyUsage: {
      findMany: async () => [],
    },
    lesson: {
      count: async () => 4,
    },
    lessonCompletion: {
      count: async () => 0,
    },
  });

  const overview = await service.getOverview('user-1');

  assert.equal(overview.summary.lessonsCompleted, 0);
  assert.equal(overview.summary.totalLessons, 4);
});

test('getOverview uses explicit lesson completion records', async () => {
  const service = createService({
    questionAttempt: {
      findMany: async () => [],
      count: async () => 0,
    },
    dailyUsage: {
      findMany: async () => [],
    },
    lesson: {
      count: async () => 4,
    },
    lessonCompletion: {
      count: async () => 3,
    },
  });

  const overview = await service.getOverview('user-1');

  assert.equal(overview.summary.lessonsCompleted, 3);
  assert.equal(overview.summary.totalLessons, 4);
});
