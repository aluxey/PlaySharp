import Link from 'next/link';

import { getDailyQuiz } from '../../lib/api';
import { routes } from '../../lib/routes';

const letters = ['A', 'B', 'C', 'D', 'E'] as const;

export default async function QuizPage() {
  const dailyQuiz = await getDailyQuiz('poker');
  const choices = dailyQuiz?.question.choices ?? [];

  return (
    <main className="page-shell quiz-page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Quiz engine</p>
          <h2>Answer fast, learn faster</h2>
        </div>
        <p>A short, high-clarity practice flow built for decision making.</p>
      </section>

      <section className="quiz-shell" aria-label="Daily quiz preview">
        <article className="quiz-stage">
          <div className="quiz-stage__line">
            <p className="panel__label">Daily question</p>
            <span className="status-chip">Live preview</span>
          </div>

          <h1 className="quiz-stage__question">
            {dailyQuiz?.question.title ?? 'The next quiz spot will appear here.'}
          </h1>

          <p className="quiz-stage__meta">
            {dailyQuiz
              ? `${dailyQuiz.game.toUpperCase()} · ${dailyQuiz.themeName}`
              : 'Connect the API to preview the current daily drill.'}
          </p>

          <p className="quiz-stage__meta">
            {dailyQuiz?.question.scenario ??
              'The scenario card keeps the product feeling premium before the interactive engine is complete.'}
          </p>

          <div className="quiz-answer-grid">
            {choices.length > 0
              ? choices.map((choice, index) => (
                  <div className="quiz-answer" key={`${choice.label}-${index}`}>
                    <div>
                      <div className="quiz-answer__label">
                        {letters[index] ?? '?'} · {choice.label}
                      </div>
                      <div className="quiz-answer__hint">Tap to answer</div>
                    </div>
                    <span className="lesson-chip">Option {index + 1}</span>
                  </div>
                ))
              : letters.slice(0, 3).map((letter) => (
                  <div className="quiz-answer" key={letter}>
                    <div>
                      <div className="quiz-answer__label">{letter} · Answer option</div>
                      <div className="quiz-answer__hint">Waiting for API data</div>
                    </div>
                  </div>
                ))}
          </div>
        </article>

        <aside className="focus-card">
          <p className="panel__label">Coach notes</p>
          <h3 className="focus-card__title">Why this spot matters</h3>

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
              <strong>Feedback</strong>
              <span>
                {dailyQuiz?.question.explanation ??
                  'The explanation appears after the answer step.'}
              </span>
            </div>
          </div>

          <Link className="button button--primary" href={routes.dashboard}>
            Back to dashboard
          </Link>
        </aside>
      </section>
    </main>
  );
}
