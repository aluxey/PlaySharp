import Link from 'next/link';

import { getDailyQuiz, getGameSummaries } from '../lib/api';
import { routes } from '../lib/routes';
import { heroHighlights, siteConfig } from '../lib/site';

const loopCards = [
  {
    step: '01',
    title: 'Read the spot',
    text: 'You get a focused scenario instead of a noisy content feed.',
  },
  {
    step: '02',
    title: 'Answer fast',
    text: 'Options stay obvious and the flow stays frictionless.',
  },
  {
    step: '03',
    title: 'Get coached',
    text: 'Explanations connect the choice back to the game plan.',
  },
  {
    step: '04',
    title: 'Improve daily',
    text: 'Progress and weak themes turn practice into a habit.',
  },
] as const;

export default async function HomePage() {
  const [games, dailyQuiz] = await Promise.all([getGameSummaries(), getDailyQuiz('poker')]);

  const totals = games.reduce(
    (acc, game) => ({
      themeCount: acc.themeCount + game.themeCount,
      lessonCount: acc.lessonCount + game.lessonCount,
      questionCount: acc.questionCount + game.questionCount,
    }),
    { themeCount: 0, lessonCount: 0, questionCount: 0 },
  );

  const choices = dailyQuiz?.question.choices ?? [];

  return (
    <main className="page-shell marketing-shell">
      <section className="marketing-hero">
        <div className="marketing-copy">
          <p className="hero-kicker">
            <span className="hero-kicker__dot" /> Daily performance training
          </p>
          <h1 className="hero-title">Train poker and blackjack like a premium coaching product.</h1>
          <p className="hero-copy">{siteConfig.description}</p>

          <div className="hero-actions">
            <Link className="button button--primary" href={routes.quiz}>
              Start daily quiz
            </Link>
            <Link className="button button--secondary" href={routes.lessons}>
              Browse lessons
            </Link>
            <Link className="button button--ghost" href={routes.dashboard}>
              Open dashboard
            </Link>
          </div>

          <div className="hero-proof">
            <div className="proof-tile">
              <span className="proof-tile__value">{games.length || 2}</span>
              <span className="proof-tile__label">Games covered</span>
            </div>
            <div className="proof-tile">
              <span className="proof-tile__value">{totals.themeCount || 2}</span>
              <span className="proof-tile__label">Themes ready</span>
            </div>
            <div className="proof-tile">
              <span className="proof-tile__value">{totals.questionCount || 4}</span>
              <span className="proof-tile__label">Quiz prompts</span>
            </div>
          </div>

          <ul className="bullet-list">
            {heroHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="spotlight-card">
          <div className="spotlight-card__topline">
            <p className="panel__label">Daily drill</p>
            <span className="status-chip">Live preview</span>
          </div>

          <h2>{dailyQuiz?.question.title ?? 'Your next spot is ready'}</h2>
          <p className="spotlight-card__meta">
            {dailyQuiz
              ? `${dailyQuiz.game.toUpperCase()} · ${dailyQuiz.themeName}`
              : 'Connect the API to load the live daily question.'}
          </p>
          <p className="spotlight-card__meta">
            {dailyQuiz?.question.scenario ??
              'A polished quiz preview keeps the product feeling alive even before the interactive engine is complete.'}
          </p>

          <div className="choice-stack" aria-label="Daily quiz preview answers">
            {choices.length > 0
              ? choices.slice(0, 3).map((choice, index) => (
                  <div className="choice-card" key={`${choice.label}-${index}`}>
                    <span className="quiz-answer__label">
                      {String.fromCharCode(65 + index)}. {choice.label}
                    </span>
                    <span className="quiz-answer__hint">Coach-style answer preview</span>
                  </div>
                ))
              : heroHighlights.map((item) => (
                  <div className="choice-card choice-card--muted" key={item}>
                    <span className="quiz-answer__label">{item}</span>
                  </div>
                ))}
          </div>

          <Link className="button button--primary" href={routes.quiz}>
            Open the drill
          </Link>
        </aside>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Content engine</p>
          <h2>Structured practice for both games</h2>
        </div>
        <p>
          {totals.lessonCount} lessons, {totals.questionCount} questions.
        </p>
      </section>

      <section className="game-grid" aria-label="Game summaries">
        {games.map((game) => (
          <article
            className={game.game === 'blackjack' ? 'game-card game-card--blackjack' : 'game-card'}
            key={game.game}
          >
            <div className="game-card__header">
              <div>
                <p className="card-label">Training lane</p>
                <h3 className="game-card__title">{game.name}</h3>
              </div>
              <span className="game-card__tag">{game.themeCount} themes</span>
            </div>

            <p className="game-card__description">
              {game.game === 'poker'
                ? 'Position, ranges, pressure, and postflop clarity.'
                : 'Dealer structure, soft hands, and disciplined decision trees.'}
            </p>

            <div className="metric-row">
              <div className="metric-card">
                <span className="metric-card__value">{game.lessonCount}</span>
                <span className="metric-card__label">Lessons</span>
              </div>
              <div className="metric-card">
                <span className="metric-card__value">{game.questionCount}</span>
                <span className="metric-card__label">Questions</span>
              </div>
              <div className="metric-card">
                <span className="metric-card__value">{game.themeCount}</span>
                <span className="metric-card__label">Themes</span>
              </div>
            </div>

            <div className="lesson-card__footer">
              <span>Explore the themed drills and lesson paths.</span>
              <Link className="button button--secondary button--small" href={routes.lessons}>
                View library
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Training loop</p>
          <h2>What the experience feels like</h2>
        </div>
        <p>Short, clear, repeatable.</p>
      </section>

      <section className="loop-grid" aria-label="Training loop">
        {loopCards.map((card) => (
          <article className="timeline-card" key={card.step}>
            <span className="timeline-card__step">{card.step}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
