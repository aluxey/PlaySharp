import Link from 'next/link';

import { StatePanel } from '../../../components';
import { routes } from '../../../lib/routes';
import { getLessonBySlug } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

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
          description="This slug does not match any lesson in the live content catalog."
          actionLabel="Back to lessons"
          actionHref={routes.lessons}
        />
      </main>
    );
  }

  return (
    <main className="page page--lesson-detail">
      <section className="lesson-detail-grid">
        <article className="surface hero-panel lesson-detail-card">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" /> Lesson detail
          </p>
          <h1 className="lesson-detail-title">{lesson.data.lesson.title}</h1>
          <p className="lesson-detail-summary">{lesson.data.lesson.content}</p>

          <div className="lesson-meta-row">
            <span className="lesson-chip">{lesson.data.gameName}</span>
            <span className="lesson-chip">{lesson.data.themeName}</span>
            <span className="lesson-chip">{lesson.data.lesson.level}</span>
            <span className="lesson-chip">Open</span>
          </div>

          <div className="button-row">
            <Link className="button button--primary" href={routes.quiz}>
              Start quiz
            </Link>
            <Link className="button button--secondary" href={routes.lessons}>
              Back to library
            </Link>
          </div>
        </article>

        <aside className="surface lesson-detail-rail">
          <p className="eyebrow">Lesson path</p>
          <h2>{lesson.data.lesson.title}</h2>
          <p className="lesson-detail-summary">
            This route stays aligned with the versioned content catalog so every lesson page keeps a
            predictable structure.
          </p>

          <div className="focus-stack">
            <div className="focus-pill">
              <strong>Theme</strong>
              <span>{lesson.data.themeName}</span>
            </div>
            <div className="focus-pill">
              <strong>Difficulty</strong>
              <span>{lesson.data.lesson.level}</span>
            </div>
            <div className="focus-pill">
              <strong>Next move</strong>
              <span>Open a quiz after reading the concept.</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
