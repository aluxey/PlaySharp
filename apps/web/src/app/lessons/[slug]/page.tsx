import Link from 'next/link';

import { getGameContent } from '../../../lib/api';
import { routes } from '../../../lib/routes';

type LessonView = {
  gameName: string;
  gameCode: string;
  themeName: string;
  themeSlug: string;
  lessonSlug: string;
  title: string;
  content: string;
  level: string;
  questionCount: number;
};

async function findLesson(slug: string): Promise<LessonView | null> {
  const games = await Promise.all([getGameContent('poker'), getGameContent('blackjack')]);

  for (const game of games) {
    if (!game) continue;

    for (const theme of game.themes) {
      const lesson = theme.lessons.find((item) => item.slug === slug);

      if (lesson) {
        return {
          gameName: game.name,
          gameCode: game.game,
          themeName: theme.name,
          themeSlug: theme.slug,
          lessonSlug: lesson.slug,
          title: lesson.title,
          content: lesson.content,
          level: lesson.level,
          questionCount: theme.questions.length,
        };
      }
    }
  }

  return null;
}

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await findLesson(slug);

  return (
    <main className="page-shell lesson-page">
      {lesson ? (
        <section className="marketing-hero">
          <div className="marketing-copy">
            <p className="hero-kicker">
              <span className="hero-kicker__dot" /> Lesson detail
            </p>
            <h1 className="hero-title">{lesson.title}</h1>
            <p className="hero-copy">{lesson.content}</p>

            <div className="hero-actions">
              <span className="lesson-chip">{lesson.gameName}</span>
              <span className="lesson-chip">{lesson.themeName}</span>
              <span className="lesson-chip">{lesson.level}</span>
              <span className="lesson-chip">{lesson.questionCount} related questions</span>
            </div>

            <div className="lesson-card__footer">
              <span>Slug: {lesson.lessonSlug}</span>
              <Link className="button button--secondary button--small" href={routes.lessons}>
                Back to library
              </Link>
            </div>
          </div>

          <aside className="spotlight-card">
            <div className="spotlight-card__topline">
              <p className="panel__label">Lesson path</p>
              <span className="status-chip">{lesson.gameCode}</span>
            </div>

            <h2>{lesson.themeName}</h2>
            <p className="spotlight-card__meta">
              This route is wired to the versioned content catalog so each lesson can stay aligned
              with the seed data.
            </p>

            <div className="focus-stack">
              <div className="focus-pill">
                <strong>Theme slug</strong>
                <span>{lesson.themeSlug}</span>
              </div>
              <div className="focus-pill">
                <strong>Level</strong>
                <span>{lesson.level}</span>
              </div>
              <div className="focus-pill">
                <strong>Next move</strong>
                <span>Open a quiz after reading the concept.</span>
              </div>
            </div>
          </aside>
        </section>
      ) : (
        <section className="spotlight-card">
          <p className="panel__label">Lesson detail</p>
          <h2>Lesson not found</h2>
          <p className="spotlight-card__meta">
            This slug does not match a synced lesson yet. Once the content catalog grows, the route
            will point to a full lesson experience.
          </p>
          <Link className="button button--primary" href={routes.lessons}>
            Back to lessons
          </Link>
        </section>
      )}
    </main>
  );
}
