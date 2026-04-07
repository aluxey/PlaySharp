import Link from 'next/link';

import { getDailyQuiz, getGameSummaries } from '../../lib/api';
import { routes } from '../../lib/routes';

export default async function DashboardPage() {
  const [games, dailyQuiz] = await Promise.all([getGameSummaries(), getDailyQuiz('poker')]);

  const totals = games.reduce(
    (acc, game) => ({
      themeCount: acc.themeCount + game.themeCount,
      lessonCount: acc.lessonCount + game.lessonCount,
      questionCount: acc.questionCount + game.questionCount,
    }),
    { themeCount: 0, lessonCount: 0, questionCount: 0 },
  );

  return (
    <main className="page-shell marketing-shell dashboard-page">
      <section className="marketing-hero">
        <div className="marketing-copy">
          <p className="hero-kicker">
            <span className="hero-kicker__dot" /> Training hub
          </p>
          <h1 className="hero-title">Your practice board is ready.</h1>
          <p className="hero-copy">
            This is the command center for daily improvement. It should make the next quiz obvious,
            keep the content visible, and feel more like a premium training studio than a generic
            app.
          </p>

          <div className="hero-actions">
            <Link className="button button--primary" href={routes.quiz}>
              Start daily quiz
            </Link>
            <Link className="button button--secondary" href={routes.lessons}>
              Open lessons
            </Link>
          </div>

          <div className="metric-row">
            <div className="metric-card">
              <span className="metric-card__value">{games.length || 2}</span>
              <span className="metric-card__label">Games tracked</span>
            </div>
            <div className="metric-card">
              <span className="metric-card__value">{totals.themeCount || 2}</span>
              <span className="metric-card__label">Active themes</span>
            </div>
            <div className="metric-card">
              <span className="metric-card__value">{totals.questionCount || 4}</span>
              <span className="metric-card__label">Drills ready</span>
            </div>
          </div>
        </div>

        <aside className="focus-card">
          <p className="panel__label">Today&apos;s focus</p>
          <h3 className="focus-card__title">{dailyQuiz?.themeName ?? 'Daily quiz preview'}</h3>

          <div className="focus-stack">
            <div className="focus-pill">
              <strong>Game</strong>
              <span>{dailyQuiz?.game.toUpperCase() ?? 'POKER'}</span>
            </div>
            <div className="focus-pill">
              <strong>Theme</strong>
              <span>{dailyQuiz?.themeSlug ?? 'preflop-position'}</span>
            </div>
            <div className="focus-pill">
              <strong>Question</strong>
              <span>{dailyQuiz?.question.title ?? 'Focus on one clear decision'}</span>
            </div>
          </div>

          <Link className="button button--primary" href={routes.quiz}>
            Go to drill
          </Link>
        </aside>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Session view</p>
          <h2>What should happen next</h2>
        </div>
        <p>Fast start, clear next step, no friction.</p>
      </section>

      <section className="game-grid" aria-label="Training priorities">
        <article className="game-card">
          <div className="game-card__header">
            <div>
              <p className="card-label">Priority</p>
              <h3 className="game-card__title">Answer the daily quiz</h3>
            </div>
            <span className="game-card__tag">Core loop</span>
          </div>
          <p className="game-card__description">
            Keep the first interaction obvious: one question, one response, one explanation.
          </p>
          <div className="lesson-card__footer">
            <span>Best when opened from a focused dashboard.</span>
            <Link className="button button--secondary button--small" href={routes.quiz}>
              Launch
            </Link>
          </div>
        </article>

        <article className="game-card game-card--blackjack">
          <div className="game-card__header">
            <div>
              <p className="card-label">Priority</p>
              <h3 className="game-card__title">Review weak themes</h3>
            </div>
            <span className="game-card__tag">Coaching</span>
          </div>
          <p className="game-card__description">
            Use the lesson library to turn recurring mistakes into compact, memorable rules.
          </p>
          <div className="lesson-card__footer">
            <span>Link the weakness back to a lesson path.</span>
            <Link className="button button--secondary button--small" href={routes.lessons}>
              Explore
            </Link>
          </div>
        </article>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Daily flow</p>
          <h2>How a session should feel</h2>
        </div>
        <p>Made to feel premium, quick, and repeatable.</p>
      </section>

      <section className="loop-grid" aria-label="Daily flow">
        <article className="timeline-card">
          <span className="timeline-card__step">01</span>
          <h3>Start with a clean prompt</h3>
          <p>The next best move should be obvious the moment the page loads.</p>
        </article>
        <article className="timeline-card">
          <span className="timeline-card__step">02</span>
          <h3>Answer in a focused flow</h3>
          <p>Keep the response step short and visually precise.</p>
        </article>
        <article className="timeline-card">
          <span className="timeline-card__step">03</span>
          <h3>Read the explanation</h3>
          <p>Turn every mistake into a concise coaching moment.</p>
        </article>
        <article className="timeline-card">
          <span className="timeline-card__step">04</span>
          <h3>Return to the weak spot</h3>
          <p>Send the player straight back into the relevant lesson path.</p>
        </article>
      </section>
    </main>
  );
}
