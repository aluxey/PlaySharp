import type {
  ContentDifficulty,
  ContentCatalog,
  ContentGame,
  ContentGameName,
  ContentGameSummary,
  ContentLesson,
  ContentQuestion,
  ContentTheme,
  DailyQuiz,
} from './content';

export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiErrorCode =
  | 'ADMIN_INVALID_CONTENT'
  | 'ADMIN_RECORD_NOT_FOUND'
  | 'ADMIN_THEME_NOT_FOUND'
  | 'AUTH_EMAIL_TAKEN'
  | 'AUTH_FORBIDDEN'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_USER_NOT_FOUND'
  | 'CONTENT_UNKNOWN_GAME'
  | 'CONTENT_GAME_NOT_FOUND'
  | 'LESSON_COMPLETION_NOT_FOUND'
  | 'CONTENT_THEME_NOT_FOUND'
  | 'QUIZ_ATTEMPT_EMPTY'
  | 'QUIZ_CHOICE_NOT_FOUND'
  | 'QUIZ_GAME_NOT_FOUND'
  | 'QUIZ_INVALID_ATTEMPT'
  | 'QUIZ_UNKNOWN_GAME'
  | 'QUIZ_DAILY_NOT_FOUND'
  | 'QUIZ_QUESTION_NOT_FOUND'
  | 'UPSTREAM_UNAVAILABLE';

export type ApiErrorResponse = {
  statusCode: number;
  error: string;
  message: string;
  code: ApiErrorCode | string;
};

export type AuthRole = 'user' | 'admin';

export type AuthPlan = 'free' | 'premium';

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
  plan: AuthPlan;
};

export type AuthRegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthSession = {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type AuthSessionResponse = ApiSuccessResponse<{
  session: AuthSession;
}>;

export type AuthCurrentUserResponse = ApiSuccessResponse<{
  user: AuthUser;
}>;

export type ContentGamesResponse = ApiSuccessResponse<{
  games: ReadonlyArray<ContentGameSummary>;
}>;

export type ContentGameResponse = ApiSuccessResponse<{
  game: ContentGame;
}>;

export type ContentThemesResponse = ApiSuccessResponse<{
  game: ContentGameName;
  themes: ReadonlyArray<ContentTheme>;
}>;

export type ContentThemeLessonsResponse = ApiSuccessResponse<{
  game: ContentGameName;
  theme: string;
  lessons: ReadonlyArray<ContentLesson>;
}>;

export type ContentThemeQuestionsResponse = ApiSuccessResponse<{
  game: ContentGameName;
  theme: string;
  questions: ReadonlyArray<ContentQuestion>;
}>;

export type QuizDailyResponse = ApiSuccessResponse<{
  quiz: DailyQuiz;
}>;

export type QuizAttemptAnswerRequest = {
  themeSlug: string;
  questionSlug: string;
  selectedChoiceLabel: string;
  responseTimeMs?: number;
};

export type QuizAttemptSubmitRequest = {
  game: ContentGameName;
  answers: ReadonlyArray<QuizAttemptAnswerRequest>;
};

export type QuizAttemptAnswerResult = {
  themeSlug: string;
  themeName: string;
  questionSlug: string;
  questionTitle: string;
  selectedChoiceLabel: string;
  correctChoiceLabel: string;
  isCorrect: boolean;
  explanation: string;
};

export type QuizAttemptResult = {
  id: string;
  game: ContentGameName;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: string;
  finishedAt: string;
  answers: ReadonlyArray<QuizAttemptAnswerResult>;
};

export type QuizAttemptSubmitResponse = ApiSuccessResponse<{
  attempt: QuizAttemptResult;
}>;

export type ProgressSummary = {
  overallAccuracy: number;
  questionsAnswered: number;
  currentStreak: number;
  lessonsCompleted: number;
  totalLessons: number;
  weeklyChange: number;
};

export type ProgressTrendPoint = {
  day: string;
  accuracy: number;
};

export type ProgressThemeInsight = {
  game: ContentGameName;
  themeSlug: string;
  themeName: string;
  accuracy: number;
  questionCount: number;
  improvement: number;
};

export type RecurringMistake = {
  questionSlug: string;
  themeName: string;
  label: string;
  occurrences: number;
  lastSeen: string;
};

export type ProgressRecommendation = {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

export type ProgressOverview = {
  summary: ProgressSummary;
  weeklyAccuracy: ReadonlyArray<ProgressTrendPoint>;
  themesToImprove: ReadonlyArray<ProgressThemeInsight>;
  recurringMistakes: ReadonlyArray<RecurringMistake>;
  recommendation: ProgressRecommendation | null;
};

export type ProgressOverviewResponse = ApiSuccessResponse<{
  overview: ProgressOverview;
}>;

export type LessonCompletionRequest = {
  game: ContentGameName;
  themeSlug: string;
  lessonSlug: string;
};

export type LessonCompletionStatus = LessonCompletionRequest & {
  completed: boolean;
  completedAt: string | null;
};

export type LessonCompletionResponse = ApiSuccessResponse<{
  completion: LessonCompletionStatus;
}>;

export type ProfilePlan = 'free' | 'premium';

export type ProfileUser = {
  name: string;
  initials: string;
  email: string;
  memberSince: string;
  memberSinceLabel: string;
  plan: ProfilePlan;
  planLabel: string;
  renewalDate: string | null;
};

export type ProfileStatKey =
  | 'overallAccuracy'
  | 'quizzesCompleted'
  | 'lessonsCompleted'
  | 'currentStreak';

export type ProfileStat = {
  key: ProfileStatKey;
  label: string;
  value: string;
};

export type ProfileQuizScore = {
  name: string;
  score: number;
  total: number;
  date: string;
};

export type ProfileAchievement = {
  icon: string;
  name: string;
  unlocked: boolean;
};

export type ProfileOverview = {
  user: ProfileUser;
  stats: ReadonlyArray<ProfileStat>;
  recentQuizScores: ReadonlyArray<ProfileQuizScore>;
  achievements: ReadonlyArray<ProfileAchievement>;
};

export type ProfileOverviewResponse = ApiSuccessResponse<{
  profile: ProfileOverview;
}>;

export type AdminContentSource = {
  game: ContentGameName;
  name: string;
  path: string;
  updatedAt: string;
  themeCount: number;
  lessonCount: number;
  questionCount: number;
};

export type AdminThemeRecord = {
  game: ContentGameName;
  themeSlug: string;
  themeName: string;
  level: ContentDifficulty;
  lessonCount: number;
  questionCount: number;
};

export type AdminLessonRecord = {
  id: string;
  game: ContentGameName;
  themeSlug: string;
  lessonSlug: string;
  title: string;
  content: string;
  level: ContentDifficulty;
  archivedAt: string | null;
};

export type AdminQuestionChoiceRecord = {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string | null;
};

export type AdminQuestionRecord = {
  id: string;
  game: ContentGameName;
  themeSlug: string;
  questionSlug: string;
  title: string;
  scenario: string | null;
  difficulty: ContentDifficulty;
  explanation: string;
  isPremium: boolean;
  choiceCount: number;
  choices: ReadonlyArray<AdminQuestionChoiceRecord>;
  archivedAt: string | null;
};

export type AdminLessonMutationRequest = {
  game: ContentGameName;
  themeSlug: string;
  lessonSlug: string;
  title: string;
  content: string;
  level: ContentDifficulty;
};

export type AdminLessonMutationResponse = ApiSuccessResponse<{
  lesson: AdminLessonRecord;
}>;

export type AdminQuestionChoiceMutationRequest = {
  label: string;
  isCorrect: boolean;
  explanation?: string | null;
};

export type AdminQuestionMutationRequest = {
  game: ContentGameName;
  themeSlug: string;
  questionSlug: string;
  title: string;
  scenario?: string | null;
  difficulty: ContentDifficulty;
  explanation: string;
  isPremium: boolean;
  choices: ReadonlyArray<AdminQuestionChoiceMutationRequest>;
};

export type AdminQuestionMutationResponse = ApiSuccessResponse<{
  question: AdminQuestionRecord;
}>;

export type AdminContentExportResponse = ApiSuccessResponse<{
  catalog: ContentCatalog;
}>;

export type AdminOverview = {
  sources: ReadonlyArray<AdminContentSource>;
  totals: {
    games: number;
    themes: number;
    lessons: number;
    questions: number;
  };
};

export type AdminOverviewResponse = ApiSuccessResponse<{
  overview: AdminOverview;
}>;

export type AdminThemesResponse = ApiSuccessResponse<{
  themes: ReadonlyArray<AdminThemeRecord>;
}>;

export type AdminLessonsResponse = ApiSuccessResponse<{
  lessons: ReadonlyArray<AdminLessonRecord>;
}>;

export type AdminQuestionsResponse = ApiSuccessResponse<{
  questions: ReadonlyArray<AdminQuestionRecord>;
}>;
