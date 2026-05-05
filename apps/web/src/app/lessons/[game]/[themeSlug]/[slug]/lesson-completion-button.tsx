'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';

import type {
  ApiErrorResponse,
  LessonCompletionRequest,
  LessonCompletionResponse,
  LessonCompletionStatus,
} from '@playsharp/shared';

import { useToast } from '../../../../../components/toast-provider';
import { buildLoginRoute } from '../../../../../lib/routes';

type LessonCompletionButtonProps = {
  request: LessonCompletionRequest;
  initialCompletion: LessonCompletionStatus | null;
  isAuthenticated: boolean;
  nextPath: string;
};

export function LessonCompletionButton({
  request,
  initialCompletion,
  isAuthenticated,
  nextPath,
}: LessonCompletionButtonProps) {
  const { showToast } = useToast();
  const [completion, setCompletion] = useState(initialCompletion);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const completed = completion?.completed ?? false;

  async function markComplete() {
    if (completed || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lessons/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const payload = (await response.json().catch(() => null)) as
        | LessonCompletionResponse
        | ApiErrorResponse
        | null;

      if (!response.ok || !payload || !('data' in payload)) {
        const message =
          payload && 'message' in payload
            ? payload.message
            : 'The lesson completion could not be saved.';
        showToast({
          title: 'Completion not saved',
          description: message,
          tone: 'error',
        });
        return;
      }

      setCompletion(payload.data.completion);
      showToast({
        title: 'Lesson completed',
        description: 'Your profile and progress are now updated.',
        tone: 'success',
      });
    } catch {
      showToast({
        title: 'Completion not saved',
        description: 'The API could not be reached.',
        tone: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <Link
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-surface"
        href={buildLoginRoute(nextPath)}
      >
        Log in to complete
      </Link>
    );
  }

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
        completed
          ? 'border-success/30 bg-success/10 text-success'
          : 'border-primary/30 bg-primary text-background hover:bg-primary/90'
      }`}
      disabled={completed || isSubmitting}
      onClick={markComplete}
      type="button"
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      {completed ? 'Completed' : 'Mark complete'}
    </button>
  );
}
