import type {
  ApiErrorResponse,
  QuizAttemptSubmitRequest,
  QuizAttemptSubmitResponse,
  QuizAttemptResult,
} from '@playsharp/shared';

export type QuizSubmitResult = {
  data: QuizAttemptResult | null;
  error: ApiErrorResponse | null;
};

function upstreamUnavailable(path: string): ApiErrorResponse {
  return {
    statusCode: 503,
    error: 'Service Unavailable',
    code: 'UPSTREAM_UNAVAILABLE',
    message: `Could not reach ${path}.`,
  };
}

function normalizeError(path: string, statusCode: number, payload: unknown): ApiErrorResponse {
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
    message: `Unexpected response for ${path}.`,
  };
}

export async function submitQuizAttempt(
  input: QuizAttemptSubmitRequest,
): Promise<QuizSubmitResult> {
  const path = '/api/quiz/attempts';

  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    const payload = (await response.json().catch(() => null)) as
      | QuizAttemptSubmitResponse
      | ApiErrorResponse
      | null;

    if (!response.ok) {
      return {
        data: null,
        error: normalizeError(path, response.status, payload),
      };
    }

    if (!payload || !('data' in payload)) {
      return {
        data: null,
        error: normalizeError(path, response.status, payload),
      };
    }

    return {
      data: payload.data.attempt,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: upstreamUnavailable(path),
    };
  }
}
