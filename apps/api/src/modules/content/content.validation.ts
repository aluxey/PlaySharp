import type {
  ContentChoice,
  ContentDifficulty,
  ContentGame,
  ContentGameName,
  ContentLesson,
  ContentQuestion,
  ContentTheme,
} from '@playsharp/shared';

const difficultyLevels = new Set<ContentDifficulty>(['beginner', 'intermediate', 'advanced']);

type JsonRecord = Record<string, unknown>;

function contentError(sourcePath: string, message: string) {
  return new Error(`${sourcePath}: ${message}`);
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, path: string, sourcePath: string): JsonRecord {
  if (!isRecord(value)) {
    throw contentError(sourcePath, `${path} must be an object.`);
  }

  return value;
}

function requireString(value: unknown, path: string, sourcePath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw contentError(sourcePath, `${path} must be a non-empty string.`);
  }

  return value;
}

function requireOptionalString(
  value: unknown,
  path: string,
  sourcePath: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return requireString(value, path, sourcePath);
}

function requireBoolean(value: unknown, path: string, sourcePath: string): boolean {
  if (typeof value !== 'boolean') {
    throw contentError(sourcePath, `${path} must be a boolean.`);
  }

  return value;
}

function requireArray(value: unknown, path: string, sourcePath: string): ReadonlyArray<unknown> {
  if (!Array.isArray(value)) {
    throw contentError(sourcePath, `${path} must be an array.`);
  }

  return value;
}

function requireDifficulty(value: unknown, path: string, sourcePath: string): ContentDifficulty {
  const difficulty = requireString(value, path, sourcePath);

  if (!difficultyLevels.has(difficulty as ContentDifficulty)) {
    throw contentError(sourcePath, `${path} must be one of: beginner, intermediate, advanced.`);
  }

  return difficulty as ContentDifficulty;
}

function ensureUniqueStrings(
  values: ReadonlyArray<string>,
  path: string,
  fieldName: string,
  sourcePath: string,
) {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      throw contentError(sourcePath, `${path} contains a duplicate ${fieldName}: ${value}.`);
    }

    seen.add(value);
  }
}

function validateChoice(value: unknown, path: string, sourcePath: string): ContentChoice {
  const record = requireRecord(value, path, sourcePath);
  const explanation = requireOptionalString(record.explanation, `${path}.explanation`, sourcePath);

  return {
    label: requireString(record.label, `${path}.label`, sourcePath),
    isCorrect: requireBoolean(record.isCorrect, `${path}.isCorrect`, sourcePath),
    ...(explanation ? { explanation } : {}),
  };
}

function validateQuestion(value: unknown, path: string, sourcePath: string): ContentQuestion {
  const record = requireRecord(value, path, sourcePath);
  const scenario = requireOptionalString(record.scenario, `${path}.scenario`, sourcePath);
  const choices = requireArray(record.choices, `${path}.choices`, sourcePath).map((choice, index) =>
    validateChoice(choice, `${path}.choices[${index}]`, sourcePath),
  );

  if (choices.length < 2) {
    throw contentError(sourcePath, `${path}.choices must contain at least two choices.`);
  }

  ensureUniqueStrings(
    choices.map((choice) => choice.label),
    `${path}.choices`,
    'choice label',
    sourcePath,
  );

  const correctChoiceCount = choices.filter((choice) => choice.isCorrect).length;

  if (correctChoiceCount !== 1) {
    throw contentError(sourcePath, `${path}.choices must contain exactly one correct choice.`);
  }

  return {
    slug: requireString(record.slug, `${path}.slug`, sourcePath),
    title: requireString(record.title, `${path}.title`, sourcePath),
    difficulty: requireDifficulty(record.difficulty, `${path}.difficulty`, sourcePath),
    explanation: requireString(record.explanation, `${path}.explanation`, sourcePath),
    isPremium: requireBoolean(record.isPremium, `${path}.isPremium`, sourcePath),
    choices,
    ...(scenario ? { scenario } : {}),
  };
}

function validateLesson(value: unknown, path: string, sourcePath: string): ContentLesson {
  const record = requireRecord(value, path, sourcePath);

  return {
    slug: requireString(record.slug, `${path}.slug`, sourcePath),
    title: requireString(record.title, `${path}.title`, sourcePath),
    content: requireString(record.content, `${path}.content`, sourcePath),
    level: requireDifficulty(record.level, `${path}.level`, sourcePath),
  };
}

function validateTheme(value: unknown, path: string, sourcePath: string): ContentTheme {
  const record = requireRecord(value, path, sourcePath);
  const lessons = requireArray(record.lessons, `${path}.lessons`, sourcePath).map((lesson, index) =>
    validateLesson(lesson, `${path}.lessons[${index}]`, sourcePath),
  );
  const questions = requireArray(record.questions, `${path}.questions`, sourcePath).map(
    (question, index) => validateQuestion(question, `${path}.questions[${index}]`, sourcePath),
  );

  ensureUniqueStrings(
    lessons.map((lesson) => lesson.slug),
    `${path}.lessons`,
    'lesson slug',
    sourcePath,
  );
  ensureUniqueStrings(
    questions.map((question) => question.slug),
    `${path}.questions`,
    'question slug',
    sourcePath,
  );

  return {
    slug: requireString(record.slug, `${path}.slug`, sourcePath),
    name: requireString(record.name, `${path}.name`, sourcePath),
    level: requireDifficulty(record.level, `${path}.level`, sourcePath),
    lessons,
    questions,
  };
}

export function validateGameContent(
  expectedGame: ContentGameName,
  value: unknown,
  sourcePath: string,
): ContentGame {
  const record = requireRecord(value, 'content', sourcePath);
  const game = requireString(record.game, 'game', sourcePath);

  if (game !== expectedGame) {
    throw contentError(sourcePath, `game must be ${expectedGame}, received ${game}.`);
  }

  const themes = requireArray(record.themes, 'themes', sourcePath).map((theme, index) =>
    validateTheme(theme, `themes[${index}]`, sourcePath),
  );

  ensureUniqueStrings(
    themes.map((theme) => theme.slug),
    'themes',
    'theme slug',
    sourcePath,
  );

  return {
    game: expectedGame,
    name: requireString(record.name, 'name', sourcePath),
    themes,
  };
}
