import Link from 'next/link';
import { heroHighlights, siteConfig } from '../lib/site';

const featureCards = [
  {
    title: 'Daily drills',
    text: 'A focused quiz flow that keeps practice short, consistent, and easy to repeat.',
  },
  {
    title: 'Immediate feedback',
    text: 'Every answer is corrected with a clear explanation and the next best action.',
  },
  {
    title: 'Progress visibility',
    text: 'Track weak themes, success rate, and streaks without adding friction.',
  },
] as const;

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Training platform</p>
          <h1>{siteConfig.name}</h1>
          <p className="lead">{siteConfig.description}</p>

          <div className="button-row">
            <Link className="button button--primary" href="/quiz">
              Start daily quiz
            </Link>
            <Link className="button button--secondary" href="/lessons">
              Explore lessons
            </Link>
          </div>

          <ul className="bullet-list">
            {heroHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="hero__panel">
          <p className="panel__label">V1 focus</p>
          <ul className="check-list">
            <li>Poker and blackjack content</li>
            <li>Lesson library and quiz engine</li>
            <li>Integrated admin workspace</li>
            <li>Progress tracking foundation</li>
          </ul>
        </aside>
      </section>

      <section className="section-grid" aria-label="Product highlights">
        {featureCards.map((card) => (
          <article className="feature-card" key={card.title}>
            <p className="card-label">Feature</p>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
