import type {
  ContentDifficulty,
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
  | 'AUTH_EMAIL_TAKEN'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_USER_NOT_FOUND'
  | 'CONTENT_UNKNOWN_GAME'
  | 'CONTENT_GAME_NOT_FOUND'
  | 'CONTENT_THEME_NOT_FOUND'
  | 'QUIZ_UNKNOWN_GAME'
  | 'QUIZ_DAILY_NOT_FOUND'
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
  game: ContentGameName;
  themeSlug: string;
  lessonSlug: string;
  title: string;
  level: ContentDifficulty;
};

export type AdminQuestionRecord = {
  game: ContentGameName;
  themeSlug: string;
  questionSlug: string;
  title: string;
  difficulty: ContentDifficulty;
  isPremium: boolean;
  choiceCount: number;
};

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
