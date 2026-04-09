import type {
  AdminLessonsResponse,
  AdminOverviewResponse,
  AdminQuestionsResponse,
  AdminThemesResponse,
  ApiErrorResponse,
  ContentGame,
  ContentGameName,
  ContentGameResponse,
  ContentGamesResponse,
  ContentGameSummary,
  ProfileOverview,
  ProfileOverviewResponse,
  ProgressOverview,
  ProgressOverviewResponse,
  DailyQuiz,
  QuizDailyResponse,
} from '@playsharp/shared';

const apiBaseUrl = (process.env.API_BASE_URL ?? 'http://127.0.0.1:3001/api').replace(/\/$/, '');

export type ApiResource<T> = {
  data: T | null;
  error: ApiErrorResponse | null;
};

export type LessonDetail = {
  game: ContentGameName;
  gameName: string;
  themeSlug: string;
  themeName: string;
  lesson: ContentGame['themes'][number]['lessons'][number];
};

function upstreamUnavailable(path: string): ApiErrorResponse {
  return {
    statusCode: 503,
    error: 'Service Unavailable',
    code: 'UPSTREAM_UNAVAILABLE',
    message: `Could not reach the API for ${path}.`,
  };
}

function normalizeError(
  path: string,
  statusCode: number,
  payload: unknown,
): ApiErrorResponse {
  if (
    payload &&
    typeof payload === 'object' &&
    'statusCode' in payload &&
    'error' in payload &&
    'message' in payload &&
    'code' in payload
  ) {
    return payload as ApiErrorResponse;
  }

  return {
    statusCode,
    error: statusCode >= 500 ? 'Server Error' : 'Request Failed',
    code: 'UPSTREAM_UNAVAILABLE',
    message: `Unexpected API response for ${path}.`,
  };
}

async function apiGet<T>(path: string): Promise<ApiResource<T>> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => null)) as T | ApiErrorResponse | null;

    if (!response.ok) {
      return {
        data: null,
        error: normalizeError(path, response.status, payload),
      };
    }

    return {
      data: payload as T,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: upstreamUnavailable(path),
    };
  }
}

function selectData<TResponse, TData>(
  resource: ApiResource<TResponse>,
  selector: (response: TResponse) => TData,
): ApiResource<TData> {
  if (!resource.data) {
    return {
      data: null,
      error: resource.error,
    };
  }

  return {
    data: selector(resource.data),
    error: null,
  };
}

export async function getGameSummaries(): Promise<ApiResource<ReadonlyArray<ContentGameSummary>>> {
  const response = await apiGet<ContentGamesResponse>('/content/games');
  return selectData(response, (payload) => payload.data.games);
}

export async function getGameContent(game: ContentGameName): Promise<ApiResource<ContentGame>> {
  const response = await apiGet<ContentGameResponse>(`/content/games/${game}`);
  return selectData(response, (payload) => payload.data.game);
}

export async function getLessonBySlug(slug: string): Promise<ApiResource<LessonDetail>> {
  const [pokerContent, blackjackContent] = await Promise.all([
    getGameContent('poker'),
    getGameContent('blackjack'),
  ]);

  for (const content of [pokerContent.data, blackjackContent.data]) {
    if (!content) {
      continue;
    }

    for (const theme of content.themes) {
      const lesson = theme.lessons.find((entry) => entry.slug === slug);
      if (lesson) {
        return {
          data: {
            game: content.game,
            gameName: content.name,
            themeSlug: theme.slug,
            themeName: theme.name,
            lesson,
          },
          error: null,
        };
      }
    }
  }

  return {
    data: null,
    error: pokerContent.error ?? blackjackContent.error,
  };
}

export async function getDailyQuiz(
  game: ContentGameName = 'poker',
): Promise<ApiResource<DailyQuiz>> {
  const response = await apiGet<QuizDailyResponse>(`/quiz/daily?game=${game}`);
  return selectData(response, (payload) => payload.data.quiz);
}

export async function getProgressOverview(): Promise<ApiResource<ProgressOverview>> {
  const response = await apiGet<ProgressOverviewResponse>('/stats/me');
  return selectData(response, (payload) => payload.data.overview);
}

export async function getProfileOverview(): Promise<ApiResource<ProfileOverview>> {
  const response = await apiGet<ProfileOverviewResponse>('/users/me/profile');
  return selectData(response, (payload) => payload.data.profile);
}

export async function getAdminOverview() {
  const response = await apiGet<AdminOverviewResponse>('/admin/overview');
  return selectData(response, (payload) => payload.data.overview);
}

export async function getAdminThemes() {
  const response = await apiGet<AdminThemesResponse>('/admin/themes');
  return selectData(response, (payload) => payload.data.themes);
}

export async function getAdminLessons() {
  const response = await apiGet<AdminLessonsResponse>('/admin/lessons');
  return selectData(response, (payload) => payload.data.lessons);
}

export async function getAdminQuestions() {
  const response = await apiGet<AdminQuestionsResponse>('/admin/questions');
  return selectData(response, (payload) => payload.data.questions);
}
