import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers3,
  ListChecks,
  Target,
} from 'lucide-react';

import { StatePanel } from '../../../../../components';
import {
  getCurrentAuthUser,
  getLessonByRoute,
  getLessonCompletionStatus,
} from '../../../../../lib/api';
import { lessonDetailRoute, lessonThemeRoute, routes } from '../../../../../lib/routes';
import { LessonCompletionButton } from './lesson-completion-button';

export const dynamic = 'force-dynamic';

const difficultyStyles = {
  beginner: 'border-success/30 bg-success/10 text-success',
  intermediate: 'border-warning/30 bg-warning/10 text-warning',
  advanced: 'border-error/30 bg-error/10 text-error',
} as const;

function sentenceCase(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function buildLessonTakeaway(content: string) {
  const [firstSentence] = content.split(/(?<=\.)\s+/);
  return firstSentence || content;
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ game: string; themeSlug: string; slug: string }>;
}) {
  const { game, themeSlug, slug } = await params;

  if (game !== 'poker' && game !== 'blackjack') {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lesson detail"
          title="Unknown game"
          description={`The route does not match a supported game: ${game}.`}
          actionLabel="Back to lessons"
          actionHref={routes.lessons}
        />
      </main>
    );
  }

  const [lesson, currentUser] = await Promise.all([
    getLessonByRoute(game, themeSlug, slug),
    getCurrentAuthUser(),
  ]);

  if (lesson.error) {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lesson detail"
          title="Lesson data is unavailable"
          description={lesson.error.message}
          actionLabel="Back to lessons"
          actionHref={routes.lessons}
          tone="error"
        />
      </main>
    );
  }

  if (!lesson.data) {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lesson detail"
          title="Lesson not found"
          description="This game/theme/lesson path does not match the live content catalog."
          actionLabel="Back to lessons"
          actionHref={routes.lessons}
        />
      </main>
    );
  }

  const completion = currentUser.data
    ? await getLessonCompletionStatus({
        game,
        themeSlug,
        lessonSlug: slug,
      })
    : { data: null };
  const currentPath = lessonDetailRoute(game, themeSlug, slug);
  const themePath = lessonThemeRoute(lesson.data.game, lesson.data.themeSlug);
  const lessonLevel = lesson.data.lesson.level;
  const takeaway = buildLessonTakeaway(lesson.data.lesson.content);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <Link
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
            href={themePath}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {lesson.data.themeName}
          </Link>

          <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-end">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-border bg-surface-elevated px-3 py-1 text-sm font-medium text-foreground-secondary">
                  {lesson.data.gameName}
                </span>
                <span className="rounded-lg border border-border bg-surface-elevated px-3 py-1 text-sm font-medium text-foreground-secondary">
                  {lesson.data.themeName}
                </span>
                <span
                  className={`rounded-lg border px-3 py-1 text-sm font-medium ${difficultyStyles[lessonLevel]}`}
                >
                  {sentenceCase(lessonLevel)}
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
                {lesson.data.lesson.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground-secondary">
                {lesson.data.lesson.content}
              </p>
            </div>

            <aside className="rounded-2xl border border-border bg-surface-elevated p-5">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Lesson brief</h2>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-foreground-secondary">Reading time</span>
                  <span className="inline-flex items-center gap-2 text-foreground">
                    <Clock3 className="h-4 w-4" />3 min
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-foreground-secondary">Path</span>
                  <span className="text-right text-foreground">{lesson.data.themeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-secondary">Status</span>
                  <span className="text-right text-foreground">
                    {completion.data?.completed ? 'Completed' : 'In progress'}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface-elevated p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                  Core idea
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">What to remember</h2>
              </div>
            </div>

            <p className="text-xl leading-9 text-foreground">{takeaway}</p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface-elevated p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers3 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">Read the spot</h3>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Identify the game, theme, and pressure point before choosing an action.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <ListChecks className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">Use the rule</h3>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Apply the principle from this lesson before relying on instinct.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">Lock it in</h3>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Complete the lesson, then test the same concept in quiz mode.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface-elevated p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                  Lesson notes
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Make the decision simpler
                </h2>
              </div>
            </div>

            <div className="space-y-5 text-base leading-8 text-foreground-secondary">
              <p>{lesson.data.lesson.content}</p>
              <p>
                The practical goal is to reduce hesitation. When a similar spot appears, look for
                the theme first, then compare the available actions against this rule.
              </p>
              <p>
                If the answer feels close, mark the theme for review and run another quiz set after
                reading the next lesson in this path.
              </p>
            </div>
          </section>
        </article>

        <aside className="space-y-5 xl:sticky xl:top-8 xl:self-start">
          <section className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h2 className="font-semibold text-foreground">Next action</h2>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">
              Save progress here, then test the concept while it is fresh.
            </p>
            <div className="mt-5 grid gap-3">
              <LessonCompletionButton
                initialCompletion={completion.data}
                isAuthenticated={currentUser.data !== null}
                nextPath={currentPath}
                request={{
                  game,
                  themeSlug,
                  lessonSlug: slug,
                }}
              />
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                href={routes.quiz}
              >
                Start quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30"
                href={themePath}
              >
                Back to theme
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h2 className="font-semibold text-foreground">Practice cue</h2>
            <div className="mt-4 space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <p className="text-sm font-medium text-foreground">Watch for</p>
                <p className="mt-1 text-sm leading-6 text-foreground-secondary">
                  Spots from {lesson.data.themeName} where the obvious move is not always the best
                  move.
                </p>
              </div>
              <div className="border-l-2 border-warning pl-4">
                <p className="text-sm font-medium text-foreground">Avoid</p>
                <p className="mt-1 text-sm leading-6 text-foreground-secondary">
                  Answering from habit before checking the pressure, price, or position described in
                  the spot.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
