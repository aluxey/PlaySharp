import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validateContentGame } from './content.loader';

test('validateContentGame accepts valid content', () => {
  const content = validateContentGame(
    {
      game: 'poker',
      name: 'Poker',
      themes: [
        {
          slug: 'ranges',
          name: 'Ranges',
          level: 'beginner',
          lessons: [
            {
              slug: 'open-raise',
              title: 'Open raise',
              content: 'Open with a clear range.',
              level: 'beginner',
            },
          ],
          questions: [
            {
              slug: 'utg-open',
              title: 'UTG open',
              difficulty: 'beginner',
              explanation: 'Raise the strongest part of the range.',
              isPremium: false,
              choices: [
                { label: 'Fold', isCorrect: false },
                { label: 'Raise', isCorrect: true },
              ],
            },
          ],
        },
      ],
    },
    'poker',
  );

  assert.equal(content.themes[0]?.questions[0]?.choices.length, 2);
});

test('validateContentGame rejects questions without exactly one correct choice', () => {
  assert.throws(
    () =>
      validateContentGame(
        {
          game: 'poker',
          name: 'Poker',
          themes: [
            {
              slug: 'ranges',
              name: 'Ranges',
              level: 'beginner',
              lessons: [],
              questions: [
                {
                  slug: 'utg-open',
                  title: 'UTG open',
                  difficulty: 'beginner',
                  explanation: 'Pick one.',
                  isPremium: false,
                  choices: [
                    { label: 'Fold', isCorrect: false },
                    { label: 'Call', isCorrect: false },
                  ],
                },
              ],
            },
          ],
        },
        'poker',
      ),
    /exactly one correct choice/,
  );
});
