import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ServiceUnavailableException } from '@nestjs/common';

import type { PrismaService } from '../prisma/prisma.service';
import { ContentService } from './content.service';

function createService(prisma: unknown) {
  return new ContentService(prisma as PrismaService);
}

const syncedAt = new Date('2026-05-04T10:00:00.000Z');

test('getCatalog projects seeded database content into the public catalog contract', async () => {
  const service = createService({
    contentSync: {
      findUnique: async () => ({
        source: 'content-json',
        version: 'version-1',
        syncedAt,
      }),
    },
    game: {
      findMany: async () => [
        {
          name: 'POKER',
          themes: [
            {
              slug: 'ranges',
              name: 'Ranges',
              level: 'BEGINNER',
              lessons: [
                {
                  slug: 'open-raise',
                  title: 'Open Raise',
                  content: 'Open strong hands first in.',
                  level: 'BEGINNER',
                },
              ],
              questions: [
                {
                  slug: 'utg-open',
                  title: 'UTG Open',
                  scenario: null,
                  difficulty: 'BEGINNER',
                  explanation: 'Raise the top of range.',
                  isPremium: false,
                  choices: [
                    { label: 'Fold', isCorrect: false, explanation: null },
                    { label: 'Raise', isCorrect: true, explanation: null },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const catalog = await service.getCatalog();

  assert.equal(catalog[0]?.game, 'poker');
  assert.equal(catalog[0]?.themes[0]?.lessons[0]?.slug, 'open-raise');
  assert.equal(catalog[0]?.themes[0]?.questions[0]?.choices.length, 2);
});

test('getCatalog fails clearly when the database was not seeded', async () => {
  const service = createService({
    contentSync: {
      findUnique: async () => null,
    },
  });

  await assert.rejects(() => service.getCatalog(), ServiceUnavailableException);
});

test('getCatalog fails clearly when persisted content is invalid', async () => {
  const service = createService({
    contentSync: {
      findUnique: async () => ({
        source: 'content-json',
        version: 'version-1',
        syncedAt,
      }),
    },
    game: {
      findMany: async () => [
        {
          name: 'POKER',
          themes: [
            {
              slug: 'ranges',
              name: 'Ranges',
              level: 'BEGINNER',
              lessons: [],
              questions: [
                {
                  slug: 'utg-open',
                  title: 'UTG Open',
                  scenario: null,
                  difficulty: 'BEGINNER',
                  explanation: 'Pick one.',
                  isPremium: false,
                  choices: [
                    { label: 'Fold', isCorrect: false, explanation: null },
                    { label: 'Call', isCorrect: false, explanation: null },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  await assert.rejects(() => service.getCatalog(), ServiceUnavailableException);
});
