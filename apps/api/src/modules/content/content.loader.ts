import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  type ContentCatalog,
  type ContentChoice,
  type ContentDifficulty,
  type ContentGame,
  type ContentGameName,
  type ContentLesson,
  type ContentQuestion,
  type ContentTheme,
  supportedGames,
} from '@playsharp/shared';

const contentRoot = resolve(process.cwd(), '..', '..', 'content');
const supportedDifficulties = ['beginner', 'intermediate', 'advanced'] as const;

function contentFilePath(game: ContentGameName) {
  return resolve(contentRoot, game, 'content.json');
}

function contentRelativePath(game: ContentGameName) {
  return `content/${game}/content.json`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value: unknown, path: string, errors: string[]) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${path} must be a non-empty string.`);
    return '';
  }

  return value;
}

function requireBoolean(value: unknown, path: string, errors: string[]) {
  if (typeof value !== 'boolean') {
    errors.push(`${path} must be a boolean.`);
    return false;
  }

  return value;
}

function requireDifficulty(value: unknown, path: string, errors: string[]): ContentDifficulty {
  if (!supportedDifficulties.includes(value as ContentDifficulty)) {
    errors.push(`${path} must be one of: ${supportedDifficulties.join(', ')}.`);
    return 'beginner';
  }

  return value as ContentDifficulty;
}

function requireArray(value: unknown, path: string, errors: string[]) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return [];
  }

  return value;
}

function ensureUnique(values: ReadonlyArray<string>, path: string, errors: string[]) {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      errors.push(`${path} contains duplicate slug: ${value}.`);
    }

    seen.add(value);
  }
}

function parseChoice(value: unknown, path: string, errors: string[]): ContentChoice {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return { label: '', isCorrect: false };
  }

  const explanation = value.explanation;

  if (explanation !== undefined && typeof explanation !== 'string') {
    errors.push(`${path}.explanation must be a string when present.`);
  }

  return {
    label: requireString(value.label, `${path}.label`, errors),
    isCorrect: requireBoolean(value.isCorrect, `${path}.isCorrect`, errors),
    ...(typeof explanation === 'string' ? { explanation } : {}),
  };
}

function parseQuestion(value: unknown, path: string, errors: string[]): ContentQuestion {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return {
      slug: '',
      title: '',
      difficulty: 'beginner',
      explanation: '',
      isPremium: false,
      choices: [],
    };
  }

  const scenario = value.scenario;
  const choices = requireArray(value.choices, `${path}.choices`, errors).map((choice, index) =>
    parseChoice(choice, `${path}.choices[${index}]`, errors),
  );
  const correctChoiceCount = choices.filter((choice) => choice.isCorrect).length;

  if (choices.length < 2) {
    errors.push(`${path}.choices must contain at least two choices.`);
  }

  if (correctChoiceCount !== 1) {
    errors.push(`${path}.choices must contain exactly one correct choice.`);
  }

  if (scenario !== undefined && typeof scenario !== 'string') {
    errors.push(`${path}.scenario must be a string when present.`);
  }

  return {
    slug: requireString(value.slug, `${path}.slug`, errors),
    title: requireString(value.title, `${path}.title`, errors),
    ...(typeof scenario === 'string' ? { scenario } : {}),
    difficulty: requireDifficulty(value.difficulty, `${path}.difficulty`, errors),
    explanation: requireString(value.explanation, `${path}.explanation`, errors),
    isPremium: requireBoolean(value.isPremium, `${path}.isPremium`, errors),
    choices,
  };
}

function parseLesson(value: unknown, path: string, errors: string[]): ContentLesson {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return { slug: '', title: '', content: '', level: 'beginner' };
  }

  return {
    slug: requireString(value.slug, `${path}.slug`, errors),
    title: requireString(value.title, `${path}.title`, errors),
    content: requireString(value.content, `${path}.content`, errors),
    level: requireDifficulty(value.level, `${path}.level`, errors),
  };
}

function parseTheme(value: unknown, path: string, errors: string[]): ContentTheme {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return { slug: '', name: '', level: 'beginner', lessons: [], questions: [] };
  }

  const lessons = requireArray(value.lessons, `${path}.lessons`, errors).map((lesson, index) =>
    parseLesson(lesson, `${path}.lessons[${index}]`, errors),
  );
  const questions = requireArray(value.questions, `${path}.questions`, errors).map(
    (question, index) => parseQuestion(question, `${path}.questions[${index}]`, errors),
  );

  ensureUnique(
    lessons.map((lesson) => lesson.slug),
    `${path}.lessons`,
    errors,
  );
  ensureUnique(
    questions.map((question) => question.slug),
    `${path}.questions`,
    errors,
  );

  return {
    slug: requireString(value.slug, `${path}.slug`, errors),
    name: requireString(value.name, `${path}.name`, errors),
    level: requireDifficulty(value.level, `${path}.level`, errors),
    lessons,
    questions,
  };
}

export function validateContentGame(value: unknown, expectedGame: ContentGameName): ContentGame {
  const errors: string[] = [];

  if (!isRecord(value)) {
    throw new Error(`Invalid ${contentRelativePath(expectedGame)}: root must be an object.`);
  }

  if (value.game !== expectedGame) {
    errors.push(`game must be "${expectedGame}".`);
  }

  const themes = requireArray(value.themes, 'themes', errors).map((theme, index) =>
    parseTheme(theme, `themes[${index}]`, errors),
  );

  ensureUnique(
    themes.map((theme) => theme.slug),
    'themes',
    errors,
  );
  const name = requireString(value.name, 'name', errors);

  if (errors.length > 0) {
    throw new Error(`Invalid ${contentRelativePath(expectedGame)}:\n- ${errors.join('\n- ')}`);
  }

  return {
    game: expectedGame,
    name,
    themes,
  };
}

async function readGameContent(game: ContentGameName): Promise<ContentGame | null> {
  try {
    const raw = await readFile(contentFilePath(game), 'utf8');
    return validateContentGame(JSON.parse(raw) as unknown, game);
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
