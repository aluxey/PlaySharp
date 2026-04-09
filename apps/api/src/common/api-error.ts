import { HttpStatus } from '@nestjs/common';

import type { ApiErrorCode, ApiErrorResponse } from '@playsharp/shared';

export function createApiError(
  statusCode: HttpStatus,
  code: ApiErrorCode,
  message: string,
): ApiErrorResponse {
  const error =
    statusCode === HttpStatus.BAD_REQUEST
      ? 'Bad Request'
      : statusCode === HttpStatus.NOT_FOUND
        ? 'Not Found'
        : 'Error';

  return {
    statusCode,
    error,
    code,
    message,
  };
}
