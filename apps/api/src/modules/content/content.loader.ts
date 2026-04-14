import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  type ContentCatalog,
  type ContentGame,
  type ContentGameName,
  supportedGames,
} from '@playsharp/shared';

import { validateGameContent } from './content.validation';

const contentRoot = resolve(process.cwd(), '..', '..', 'content');

function contentFilePath(game: ContentGameName) {
  return resolve(contentRoot, game, 'content.json');
}

function contentRelativePath(game: ContentGameName) {
  return `content/${game}/content.json`;
}

async function readGameContent(game: ContentGameName): Promise<ContentGame | null> {
  try {
    const sourcePath = contentRelativePath(game);
    const raw = await readFile(contentFilePath(game), 'utf8');
    const parsed = JSON.parse(raw) as unknown;

    return validateGameContent(game, parsed, sourcePath);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }

    if (error instanceof SyntaxError) {
      throw new Error(`${contentRelativePath(game)}: ${error.message}`);
    }

    throw error;
  }
}

export async function loadContentCatalog(): Promise<ContentCatalog> {
  const catalog = await Promise.all(supportedGames.map((game) => readGameContent(game)));
  return catalog.filter((entry): entry is ContentGame => entry !== null);
}

export async function loadGameContent(game: ContentGameName): Promise<ContentGame | null> {
  return readGameContent(game);
}

export async function listContentSources() {
  const catalog = await loadContentCatalog();

  return Promise.all(
    catalog.map(async (gameContent) => {
      const fileStats = await stat(contentFilePath(gameContent.game));

      return {
        game: gameContent.game,
        name: gameContent.name,
        path: contentRelativePath(gameContent.game),
        updatedAt: fileStats.mtime.toISOString(),
      };
    }),
  );
}

export function summarizeGameContent(gameContent: ContentGame) {
  const themeCount = gameContent.themes.length;
  const lessonCount = gameContent.themes.reduce((total, theme) => total + theme.lessons.length, 0);
  const questionCount = gameContent.themes.reduce(
    (total, theme) => total + theme.questions.length,
    0,
  );

  return {
    game: gameContent.game,
    name: gameContent.name,
    themeCount,
    lessonCount,
    questionCount,
  };
}

export function findTheme(gameContent: ContentGame, themeSlug: string) {
  return gameContent.themes.find((theme) => theme.slug === themeSlug) ?? null;
}
