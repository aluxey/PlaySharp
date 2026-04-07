import Link from 'next/link';

import { getGameContent } from '../../lib/api';
import { routes } from '../../lib/routes';

const games = ['poker', 'blackjack'] as const;

export default async function LessonsPage() {
  const catalog = await Promise.all(games.map((game) => getGameContent(game)));

  return (
    <main className="page-shell lesson-page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Content browser</p>
          <h2>Lessons organized by game and theme</h2>
        </div>
        <p>Clear paths, low friction, strong visual hierarchy.</p>
      </section>

      <div className="lesson-grid">
        {catalog.map((gameContent, gameIndex) => {
          if (!gameContent) {
            return (
              <article className="lesson-card" key={`missing-content-${gameIndex}`}>
                <div className="lesson-card__header">
                  <div>
                    <p className="lesson-card__slug">content unavailable</p>
                    <h3>Load the API to preview lesson paths.</h3>
                  </div>
                  <span className="lesson-chip">preview</span>
                </div>
              </article>
            );
          }

          const totals = gameContent.themes.reduce(
            (acc, theme) => ({
              lessons: acc.lessons + theme.lessons.length,
              questions: acc.questions + theme.questions.length,
            }),
            { lessons: 0, questions: 0 },
          );

          return (
            <section className="glass-card" key={gameContent.game}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{gameContent.name}</p>
                  <h2>
                    {gameContent.themes.length} themes, {totals.lessons} lessons, {totals.questions}{' '}
                    questions
                  </h2>
                </div>
                <p>Each theme should feel like a clean coaching lane.</p>
              </div>

              <div className="lesson-grid">
                {gameContent.themes.map((theme) => {
                  const firstLesson = theme.lessons[0];

                  return (
                    <article className="lesson-card" key={theme.slug}>
                      <div className="lesson-card__header">
                        <div>
                          <p className="lesson-card__slug">{theme.slug}</p>
                          <h3>{theme.name}</h3>
                        </div>
                        <span className="lesson-chip">{theme.level}</span>
                      </div>

                      <p>{firstLesson?.title ?? 'Lesson path ready to build.'}</p>

                      <div className="lesson-card__meta">
                        <span className="lesson-chip">{theme.lessons.length} lessons</span>
                        <span className="lesson-chip">{theme.questions.length} questions</span>
                      </div>

                      <div className="lesson-card__footer">
                        <span>
                          {theme.questions[0]?.title ?? 'Open the first lesson to start.'}
                        </span>
                        {firstLesson ? (
                          <Link
                            className="button button--secondary button--small"
                            href={`/lessons/${firstLesson.slug}`}
                          >
                            Open path
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Navigation</p>
          <h2>Move back into practice</h2>
        </div>
        <p>Lessons should always route back to a quiz or dashboard step.</p>
      </section>

      <div className="hero-actions">
        <Link className="button button--primary" href={routes.quiz}>
          Open quiz
        </Link>
        <Link className="button button--secondary" href={routes.dashboard}>
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
