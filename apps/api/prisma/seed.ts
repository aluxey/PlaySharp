import { loadEnvFile } from 'node:process';
import {
  Difficulty as PrismaDifficulty,
  GameName as PrismaGameName,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import {
  type ContentChoice,
  type ContentDifficulty,
  type ContentGame,
  type ContentGameName,
} from '@playsharp/shared';

import { loadContentCatalog } from '../src/modules/content/content.loader';

loadEnvFile('.env');

const prisma = new PrismaClient();

type Tx = Prisma.TransactionClient;

function toPrismaGameName(game: ContentGameName): PrismaGameName {
  switch (game) {
    case 'poker':
      return PrismaGameName.POKER;
    case 'blackjack':
      return PrismaGameName.BLACKJACK;
  }
}

function toPrismaDifficulty(level: ContentDifficulty): PrismaDifficulty {
  switch (level) {
    case 'beginner':
      return PrismaDifficulty.BEGINNER;
    case 'intermediate':
      return PrismaDifficulty.INTERMEDIATE;
    case 'advanced':
      return PrismaDifficulty.ADVANCED;
  }
}

async function syncChoices(tx: Tx, questionId: string, choices: ReadonlyArray<ContentChoice>) {
  const positions = choices.map((_, position) => position);

  if (positions.length === 0) {
    await tx.questionChoice.deleteMany({ where: { questionId } });
    return;
  }

  await tx.questionChoice.deleteMany({
    where: {
      questionId,
      position: { notIn: positions },
    },
  });

  for (const [position, choice] of choices.entries()) {
    await tx.questionChoice.upsert({
      where: {
        questionId_position: {
          questionId,
          position,
        },
      },
      update: {
        label: choice.label,
        isCorrect: choice.isCorrect,
        explanation: choice.explanation ?? null,
      },
      create: {
        questionId,
        position,
        label: choice.label,
        isCorrect: choice.isCorrect,
        explanation: choice.explanation ?? null,
      },
    });
  }
}

async function syncQuestions(
  tx: Tx,
  themeId: string,
  questions: ContentGame['themes'][number]['questions'],
) {
  const slugs = questions.map((question) => question.slug);

  if (slugs.length === 0) {
    await tx.question.deleteMany({ where: { themeId } });
    return;
  }

  await tx.question.deleteMany({
    where: {
      themeId,
      slug: { notIn: slugs },
    },
  });

  for (const question of questions) {
    const questionRecord = await tx.question.upsert({
      where: {
        themeId_slug: {
          themeId,
          slug: question.slug,
        },
      },
      update: {
        title: question.title,
        scenario: question.scenario ?? null,
        difficulty: toPrismaDifficulty(question.difficulty),
        explanation: question.explanation,
        isPremium: question.isPremium,
      },
      create: {
        themeId,
        slug: question.slug,
        title: question.title,
        scenario: question.scenario ?? null,
        difficulty: toPrismaDifficulty(question.difficulty),
        explanation: question.explanation,
        isPremium: question.isPremium,
      },
    });

    await syncChoices(tx, questionRecord.id, question.choices);
  }
}

async function syncLessons(
  tx: Tx,
  themeId: string,
  lessons: ContentGame['themes'][number]['lessons'],
) {
  const slugs = lessons.map((lesson) => lesson.slug);

  if (slugs.length === 0) {
    await tx.lesson.deleteMany({ where: { themeId } });
    return;
  }

  await tx.lesson.deleteMany({
    where: {
      themeId,
      slug: { notIn: slugs },
    },
  });

  for (const lesson of lessons) {
    await tx.lesson.upsert({
      where: {
        themeId_slug: {
          themeId,
          slug: lesson.slug,
        },
      },
      update: {
        title: lesson.title,
        content: lesson.content,
        level: toPrismaDifficulty(lesson.level),
      },
      create: {
        themeId,
        slug: lesson.slug,
        title: lesson.title,
        content: lesson.content,
        level: toPrismaDifficulty(lesson.level),
      },
    });
  }
}

async function syncGameContent(tx: Tx, gameContent: ContentGame) {
  const gameRecord = await tx.game.upsert({
    where: { name: toPrismaGameName(gameContent.game) },
    update: {},
    create: { name: toPrismaGameName(gameContent.game) },
  });

  const themeSlugs = gameContent.themes.map((theme) => theme.slug);

  if (themeSlugs.length === 0) {
    await tx.theme.deleteMany({ where: { gameId: gameRecord.id } });
    return;
  }

  await tx.theme.deleteMany({
    where: {
      gameId: gameRecord.id,
      slug: { notIn: themeSlugs },
    },
  });

  for (const theme of gameContent.themes) {
    const themeRecord = await tx.theme.upsert({
      where: {
        gameId_slug: {
          gameId: gameRecord.id,
          slug: theme.slug,
        },
      },
      update: {
        name: theme.name,
        level: toPrismaDifficulty(theme.level),
      },
      create: {
        gameId: gameRecord.id,
        slug: theme.slug,
        name: theme.name,
        level: toPrismaDifficulty(theme.level),
      },
    });

    await syncLessons(tx, themeRecord.id, theme.lessons);
    await syncQuestions(tx, themeRecord.id, theme.questions);
  }
}

async function main() {
  const catalog = await loadContentCatalog();

  await prisma.$transaction(async (tx: Tx) => {
    for (const gameContent of catalog) {
      await syncGameContent(tx, gameContent);
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
