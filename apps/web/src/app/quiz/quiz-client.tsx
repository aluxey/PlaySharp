'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Target } from 'lucide-react';

import type { DailyQuiz, QuizAttemptAnswerResult } from '@playsharp/shared';

import { submitQuizAttempt } from '../../lib/quiz-client';
import { lessonThemeRoute, routes } from '../../lib/routes';

type QuizClientProps = {
  quiz: DailyQuiz | null;
};

function answerKey(answer: { themeSlug: string; questionSlug: string }) {
  return `${answer.themeSlug}:${answer.questionSlug}`;
}

export function QuizClient({ quiz }: QuizClientProps) {
  const questions = useMemo(() => {
    if (!quiz) {
      return [];
    }

    return quiz.questions.length > 0
      ? quiz.questions
      : [{ themeSlug: quiz.themeSlug, themeName: quiz.themeName, question: quiz.question }];
  }, [quiz]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [attemptResult, setAttemptResult] =
    useState<Awaited<ReturnType<typeof submitQuizAttempt>>['data']>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!quiz || questions.length === 0) {
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
  const current = questions[currentIndex] ?? questions[0];

  if (!current) {
    return null;
  }

  const currentKey = answerKey({
    themeSlug: current.themeSlug,
    questionSlug: current.question.slug,
  });
  const selectedAnswer = selectedAnswers[currentKey] ?? null;
  const resultByQuestion = new Map(
    attemptResult?.answers.map((answer) => [answerKey(answer), answer]) ?? [],
  );
  const answerResult = resultByQuestion.get(currentKey) ?? null;
  const showResults = attemptResult !== null;
  const total = questions.length;
  const progress = Math.round(((currentIndex + 1) / total) * 100);
  const allAnswered = questions.every((entry) =>
    Boolean(
      selectedAnswers[
        answerKey({
          themeSlug: entry.themeSlug,
          questionSlug: entry.question.slug,
        })
      ],
    ),
  );

  async function handleSubmitAttempt() {
    if (isSubmitting || !allAnswered) {
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    const result = await submitQuizAttempt({
      game: resolvedQuiz.game,
      answers: questions.map((entry) => ({
        themeSlug: entry.themeSlug,
        questionSlug: entry.question.slug,
        selectedChoiceLabel:
          selectedAnswers[
            answerKey({
              themeSlug: entry.themeSlug,
              questionSlug: entry.question.slug,
            })
          ] ?? '',
      })),
    });

    if (result.error) {
      setSubmissionError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    setAttemptResult(result.data);
    setCurrentIndex(0);
    setIsSubmitting(false);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setAttemptResult(null);
    setIsComplete(false);
    setSubmissionError(null);
    setIsSubmitting(false);
  }

  function selectChoice(label: string) {
    if (showResults || isSubmitting) {
      return;
    }

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentKey]: label,
    }));
  }

  if (isComplete && attemptResult) {
    const percentage = Math.round((attemptResult.score / total) * 100);
    const tag =
      percentage === 100 ? 'Perfect Score!' : percentage >= 70 ? 'Great Job!' : 'Keep Training!';

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-surface-elevated border border-border rounded-3xl p-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
            {percentage === 100 ? 'Trophy' : percentage >= 70 ? 'Target' : 'Train'}
          </div>
          <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
            Quiz complete
          </p>
          <h1 className="text-3xl font-bold text-foreground">{tag}</h1>
          <p className="text-4xl font-extrabold text-foreground">
            {attemptResult.score}/{total}
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
              href={lessonThemeRoute(resolvedQuiz.game, current.themeSlug)}
            >
              Open lesson path
            </Link>
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

  const correctChoiceLabel = answerResult?.correctChoiceLabel ?? null;

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
              Question {currentIndex + 1} of {total} · Theme: {current.themeName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
            <div className="w-24 h-2 rounded-full bg-surface">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-elevated border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
              Daily set
            </span>
            <span className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-sm font-semibold">
              {resolvedQuiz.game.toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground leading-snug">
            {current.question.title}
          </h2>
          <p className="text-foreground-secondary">
            {current.question.scenario ?? current.themeName}
          </p>

          <div className="space-y-3">
            {current.question.choices.map((option) => {
              const isSelected = selectedAnswer === option.label;
              const showCorrect = showResults && option.label === correctChoiceLabel;
              const showIncorrect = showResults && isSelected && answerResult?.isCorrect === false;

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
                  onClick={() => selectChoice(option.label)}
                  disabled={showResults || isSubmitting}
                  type="button"
                >
                  <span className="font-semibold text-foreground">{option.label}</span>
                  {showResults ? (
                    <span className="float-right font-semibold">
                      {option.label === correctChoiceLabel ? 'Correct' : isSelected ? 'Miss' : ''}
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

          {showResults ? (
            <ResultPanel
              answerResult={answerResult}
              fallbackExplanation={current.question.explanation}
            />
          ) : null}

          <div className="flex justify-between items-center pt-2 gap-3">
            <button
              className="px-4 py-2 rounded-xl border border-border text-foreground disabled:opacity-50 flex items-center gap-2"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {showResults ? (
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2"
                onClick={() => {
                  if (currentIndex === total - 1) {
                    setIsComplete(true);
                    return;
                  }

                  setCurrentIndex((index) => Math.min(total - 1, index + 1));
                }}
                type="button"
              >
                {currentIndex === total - 1 ? 'Finish' : 'Next result'}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentIndex === total - 1 ? (
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-60"
                onClick={handleSubmitAttempt}
                disabled={!allAnswered || isSubmitting}
                type="button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit quiz'}
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-60 flex items-center gap-2"
                onClick={() => setCurrentIndex((index) => Math.min(total - 1, index + 1))}
                disabled={!selectedAnswer}
                type="button"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
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
              <span className="font-semibold text-right">{current.themeName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary">Answered</span>
              <span className="font-semibold">
                {Object.keys(selectedAnswers).length}/{total}
              </span>
            </div>
          </div>

          <div className="w-36 h-36 mx-auto rounded-full border border-border bg-surface flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">
              {attemptResult ? `${attemptResult.score}/${total}` : `${currentIndex + 1}/${total}`}
            </span>
            <span className="text-xs text-foreground-secondary">
              {attemptResult ? 'score' : 'progress'}
            </span>
          </div>

          <p className="text-sm text-foreground-secondary">
            Complete the set, submit once, then review every explanation before moving to lessons.
          </p>
        </aside>
      </div>
    </div>
  );
}

function ResultPanel({
  answerResult,
  fallbackExplanation,
}: {
  answerResult: QuizAttemptAnswerResult | null;
  fallbackExplanation: string;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        answerResult?.isCorrect ? 'border-success bg-success/10' : 'border-error bg-error/10'
      }`}
    >
      <p className="font-semibold mb-1">{answerResult?.isCorrect ? 'Correct' : 'Incorrect'}</p>
      <p className="text-sm text-foreground-secondary">
        {answerResult?.explanation ?? fallbackExplanation}
      </p>
    </div>
  );
}
