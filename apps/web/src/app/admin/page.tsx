import Link from 'next/link';
import { redirect } from 'next/navigation';

import { DataCard, StatePanel } from '../../components';
import {
  getAdminLessons,
  getAdminOverview,
  getAdminQuestions,
  getAdminThemes,
} from '../../lib/api';
import { AdminEditor } from './admin-editor';
import { getAuthState } from '../../lib/auth-state';
import { buildLoginRoute, routes } from '../../lib/routes';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authState = await getAuthState();

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Admin"
          title="Admin sign-in required"
          description="This workspace is restricted to authenticated admin accounts. Sign in with an admin account to review the content inventory."
          actionLabel="Log in"
          actionHref={buildLoginRoute(routes.admin)}
          tone="error"
        />
      </div>
    );
  }

  if (authState.user?.role !== 'admin') {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Admin"
          title="Admins only"
          description="This workspace is restricted to admin accounts. Signed-in learners can keep using the dashboard, quiz, lessons, and progress routes."
          actionLabel="Open dashboard"
          actionHref={routes.dashboard}
          tone="error"
        />
      </div>
    );
  }

  const [overview, themes, lessons, questions] = await Promise.all([
    getAdminOverview(),
    getAdminThemes(),
    getAdminLessons(),
    getAdminQuestions(),
  ]);

  const error = overview.error ?? themes.error ?? lessons.error ?? questions.error;

  if (error?.code === 'AUTH_UNAUTHORIZED') {
    redirect(buildLoginRoute(routes.admin));
  }

  if (error?.code === 'AUTH_FORBIDDEN') {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Admin"
          title="Admins only"
          description="The API rejected this request because the current account does not have admin access."
          actionLabel="Open dashboard"
          actionHref={routes.dashboard}
          tone="error"
        />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-12 space-y-8">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
          Internal workspace
        </p>
        <h1 className="text-4xl font-bold text-foreground">Admin</h1>
        <p className="text-foreground-secondary">
          Manage lesson and question records stored in PostgreSQL. Archived records stay visible in
          the selectors for review, but active totals exclude them.
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
          <Link
            className="px-4 py-2 rounded-xl border border-border text-foreground"
            href="/api/admin/export"
          >
            Export content
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard label="Games" value={overview.data.totals.games} />
        <DataCard label="Themes" value={overview.data.totals.themes} />
        <DataCard label="Lessons" value={overview.data.totals.lessons} />
        <DataCard label="Questions" value={overview.data.totals.questions} />
      </section>

      <AdminEditor themes={themes.data} lessons={lessons.data} questions={questions.data} />

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
