'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';

import type { DailyQuiz } from '@playsharp/shared';

import { submitQuizAttempt } from '../../lib/quiz-client';
import { routes } from '../../lib/routes';

type QuizClientProps = {
  quiz: DailyQuiz | null;
};

export function QuizClient({ quiz }: QuizClientProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attemptResult, setAttemptResult] =
    useState<Awaited<ReturnType<typeof submitQuizAttempt>>['data']>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-surface-elevated border border-border rounded-3xl p-10 text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">No quiz available</h1>
          <p className="text-foreground-secondary">The API did not return a daily quiz.</p>
        </div>
      </div>
    );
  }

  const resolvedQuiz = quiz;
  const question = resolvedQuiz.question;
  const total = 1;
  const answerResult = attemptResult?.answers[0] ?? null;
  const score = attemptResult?.score ?? 0;
  const correctChoiceLabel = answerResult?.correctChoiceLabel ?? null;

  async function handleValidate(selectedChoiceLabel: string) {
    if (showResult || isSubmitting) {
      return;
    }

    setSelectedAnswer(selectedChoiceLabel);
    setSubmissionError(null);
    setIsSubmitting(true);

    const result = await submitQuizAttempt({
      game: resolvedQuiz.game,
      answers: [
        {
          themeSlug: resolvedQuiz.themeSlug,
          questionSlug: question.slug,
          selectedChoiceLabel,
        },
      ],
    });

    if (result.error) {
      setSubmissionError(result.error.message);
      setSelectedAnswer(null);
      setIsSubmitting(false);
      return;
    }

    setAttemptResult(result.data);
    setShowResult(true);
    setIsSubmitting(false);
  }

  function handleFinish() {
    setIsComplete(true);
  }

  function handleRestart() {
    setSelectedAnswer(null);
    setShowResult(false);
    setAttemptResult(null);
    setIsComplete(false);
    setSubmissionError(null);
    setIsSubmitting(false);
  }

  if (isComplete) {
    const percentage = Math.round((score / total) * 100);
    const tag =
      percentage === 100 ? 'Perfect Score!' : percentage >= 70 ? 'Great Job!' : 'Keep Training!';

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-surface-elevated border border-border rounded-3xl p-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
            {percentage === 100 ? '🏆' : percentage >= 70 ? '🎯' : '💪'}
          </div>
          <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
            Quiz complete
          </p>
          <h1 className="text-3xl font-bold text-foreground">{tag}</h1>
          <p className="text-4xl font-extrabold text-foreground">
            {score}/{total}
          </p>
          <p className="text-foreground-secondary">{percentage}% accuracy</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              onClick={handleRestart}
              type="button"
            >
              Try again
            </button>
            <Link
              className="px-5 py-3 rounded-xl border border-border text-foreground"
              href={routes.dashboard}
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-foreground-secondary">
          <span className="w-2 h-2 rounded-full bg-primary" /> Quiz engine
        </p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Answer fast, learn faster
            </h1>
            <p className="text-foreground-secondary">
              Question 1 of 1 · Theme: {resolvedQuiz.themeName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
            <div className="w-24 h-2 rounded-full bg-surface">
              <div className="h-2 rounded-full bg-primary" style={{ width: '100%' }} />
            </div>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-elevated border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
              Daily question
            </span>
            <span className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-sm font-semibold">
              Live preview
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground leading-snug">{question.title}</h2>
          <p className="text-foreground-secondary">{question.scenario ?? resolvedQuiz.themeName}</p>

          <div className="space-y-3">
            {question.choices.map((option) => {
              const isSelected = selectedAnswer === option.label;
              const showCorrect = showResult && option.label === correctChoiceLabel;
              const showIncorrect = showResult && isSelected && answerResult?.isCorrect === false;

              return (
                <button
                  key={option.label}
                  className={`w-full text-left border rounded-xl p-4 transition-all ${
                    showCorrect
                      ? 'border-success bg-success/10'
                      : showIncorrect
                        ? 'border-error bg-error/10'
                        : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-surface'
                  }`}
                  onClick={() => handleValidate(option.label)}
                  disabled={showResult || isSubmitting}
                  type="button"
                >
                  <span className="font-semibold text-foreground">{option.label}</span>
                  {showResult ? (
                    <span className="float-right font-semibold">
                      {option.label === correctChoiceLabel ? '✓' : isSelected ? '✕' : ''}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {submissionError ? (
            <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
              {submissionError}{' '}
              {submissionError.includes('Log in') ? (
                <Link className="font-semibold underline" href={routes.login}>
                  Go to login
                </Link>
              ) : null}
            </div>
          ) : null}

          {showResult ? (
            <div
              className={`p-4 rounded-xl border ${
                answerResult?.isCorrect
                  ? 'border-success bg-success/10'
                  : 'border-error bg-error/10'
              }`}
            >
              <p className="font-semibold mb-1">
                {answerResult?.isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </p>
              <p className="text-sm text-foreground-secondary">
                {answerResult?.explanation ?? question.explanation}
              </p>
            </div>
          ) : null}

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-foreground-secondary">
              {isSubmitting ? 'Submitting your answer...' : 'Tap an answer to validate.'}
            </span>
            {showResult ? (
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2"
                onClick={handleFinish}
                type="button"
              >
                Finish
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>

        <aside className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-4">
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground-secondary">
            <Target className="w-4 h-4" /> Coach notes
          </p>
          <h3 className="text-xl font-semibold text-foreground">Why this spot matters</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary">Game</span>
              <span className="font-semibold">{resolvedQuiz.game.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary">Theme</span>
              <span className="font-semibold">{resolvedQuiz.themeName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary">Feedback</span>
              <span className="font-semibold text-right">
                {(answerResult?.explanation ?? question.explanation).slice(0, 42)}...
              </span>
            </div>
          </div>

          <div className="w-36 h-36 mx-auto rounded-full border border-border bg-surface flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">68%</span>
            <span className="text-xs text-foreground-secondary">daily accuracy</span>
          </div>

          <p className="text-sm text-foreground-secondary">
            Keep the quiz fast. The goal is to answer, read the explanation, and go straight to the
            relevant lesson path.
          </p>
        </aside>
      </div>
    </div>
  );
}
