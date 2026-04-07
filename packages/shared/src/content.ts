export type ContentGameName = 'poker' | 'blackjack';

export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ContentChoice = {
  label: string;
  explanation?: string;
  isCorrect: boolean;
};

export type ContentQuestion = {
  slug: string;
  title: string;
  scenario?: string;
  difficulty: ContentDifficulty;
  explanation: string;
  isPremium: boolean;
  choices: ReadonlyArray<ContentChoice>;
};

export type ContentLesson = {
  slug: string;
  title: string;
  content: string;
  level: ContentDifficulty;
};

export type ContentTheme = {
  slug: string;
  name: string;
  level: ContentDifficulty;
  lessons: ReadonlyArray<ContentLesson>;
  questions: ReadonlyArray<ContentQuestion>;
};

export type ContentGame = {
  game: ContentGameName;
  name: string;
  themes: ReadonlyArray<ContentTheme>;
};

export type ContentCatalog = ReadonlyArray<ContentGame>;

export type ContentGameSummary = {
  game: ContentGameName;
  name: string;
  themeCount: number;
  lessonCount: number;
  questionCount: number;
};

export type DailyQuiz = {
  game: ContentGameName;
  themeSlug: string;
  themeName: string;
  question: ContentQuestion;
};
