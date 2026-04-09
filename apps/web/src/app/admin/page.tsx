import Link from 'next/link';

import { DataCard, StatePanel } from '../../components';
import {
  getAdminLessons,
  getAdminOverview,
  getAdminQuestions,
  getAdminThemes,
} from '../../lib/api';
import { routes } from '../../lib/routes';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [overview, themes, lessons, questions] = await Promise.all([
    getAdminOverview(),
    getAdminThemes(),
    getAdminLessons(),
    getAdminQuestions(),
  ]);

  const error = overview.error ?? themes.error ?? lessons.error ?? questions.error;

  if (error) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Admin"
          title="Admin inventory is unavailable"
          description={error.message}
          actionLabel="Back to dashboard"
          actionHref={routes.dashboard}
          tone="error"
        />
      </div>
    );
  }

  if (!overview.data || !themes.data || !lessons.data || !questions.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Admin"
          title="No admin content to review"
          description="The admin API did not return a content inventory yet. Seed the content catalog and refresh the page."
          actionLabel="Open lessons"
          actionHref={routes.lessons}
        />
      </div>
    );
  }

  const sectionCards = [
    {
      title: 'Theme management',
      text: 'The theme inventory is now sourced from the API contract rather than local placeholder cards.',
      count: themes.data.length,
      points: themes.data.slice(0, 3).map((theme) => `${theme.game} · ${theme.themeName}`),
    },
    {
      title: 'Lesson workflow',
      text: 'Lessons come straight from versioned content JSON, which keeps admin and seed data aligned.',
      count: lessons.data.length,
      points: lessons.data.slice(0, 3).map((lesson) => `${lesson.game} · ${lesson.title}`),
    },
    {
      title: 'Question workflow',
      text: 'Question inventory reflects the live content contract, including premium flags and choice counts.',
      count: questions.data.length,
      points: questions.data
        .slice(0, 3)
        .map(
          (question) => `${question.game} · ${question.title} (${question.choiceCount} choices)`,
        ),
    },
  ];

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-12 space-y-8">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
          Internal workspace
        </p>
        <h1 className="text-4xl font-bold text-foreground">Admin</h1>
        <p className="text-foreground-secondary">
          The admin surface now reflects the live content inventory exposed by the API. The
          versioned JSON files remain the source of truth.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
            href={routes.dashboard}
          >
            Back to dashboard
          </Link>
          <Link
            className="px-4 py-2 rounded-xl border border-border text-foreground"
            href={routes.lessons}
          >
            Open lessons
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard label="Games" value={overview.data.totals.games} />
        <DataCard label="Themes" value={overview.data.totals.themes} />
        <DataCard label="Lessons" value={overview.data.totals.lessons} />
        <DataCard label="Questions" value={overview.data.totals.questions} />
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {sectionCards.map((card) => (
          <article
            key={card.title}
            className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.16em] text-foreground-secondary">
                Section
              </p>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {card.count}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">{card.title}</h2>
            <p className="text-foreground-secondary text-sm leading-relaxed">{card.text}</p>
            <div className="space-y-2">
              {card.points.length === 0 ? (
                <p className="text-sm text-foreground-secondary">No records available.</p>
              ) : (
                card.points.map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {point}
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="bg-surface-elevated border border-border rounded-3xl p-6 md:p-8 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
            Content source
          </p>
          <h2 className="text-2xl font-bold text-foreground">Versioned manifests</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {overview.data.sources.map((source) => (
            <div
              key={source.path}
              className="rounded-2xl border border-border bg-surface p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-foreground">{source.name}</h3>
                <span className="text-sm text-foreground-secondary">{source.game}</span>
              </div>
              <p className="font-mono text-xs text-foreground-secondary">{source.path}</p>
              <p className="text-sm text-foreground-secondary">Updated {source.updatedAt}</p>
              <div className="flex flex-wrap gap-2 text-xs text-foreground-secondary">
                <span className="rounded-full bg-surface-elevated px-3 py-1">
                  {source.themeCount} themes
                </span>
                <span className="rounded-full bg-surface-elevated px-3 py-1">
                  {source.lessonCount} lessons
                </span>
                <span className="rounded-full bg-surface-elevated px-3 py-1">
                  {source.questionCount} questions
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
