import Link from 'next/link';
import type { ReactNode } from 'react';

type ActionVariant = 'primary' | 'secondary';

export type FeatureCard = {
  title: string;
  text: string;
  points?: ReadonlyArray<string>;
};

export type FeaturePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  actions?: ReadonlyArray<{ label: string; href: string; variant?: ActionVariant }>;
  highlights?: ReadonlyArray<string>;
  asideTitle?: string;
  asideItems?: ReadonlyArray<string>;
  cards?: ReadonlyArray<FeatureCard>;
  children?: ReactNode;
};

function ActionLink({
  label,
  href,
  variant = 'secondary',
}: {
  label: string;
  href: string;
  variant?: ActionVariant;
}) {
  const className = variant === 'primary' ? 'button button--primary' : 'button button--secondary';

  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}

export function FeaturePage({
  eyebrow,
  title,
  description,
  status,
  actions = [],
  highlights = [],
  asideTitle,
  asideItems = [],
  cards = [],
  children,
}: FeaturePageProps) {
  return (
    <main className="page-shell feature-page">
      <section className="hero feature-page__hero">
        <div className="hero__copy">
          <p className="eyebrow">{eyebrow}</p>

          <div className="feature-page__title-row">
            <h1>{title}</h1>
            {status ? <span className="status-pill">{status}</span> : null}
          </div>

          <p className="lead">{description}</p>

          {actions.length > 0 ? (
            <div className="button-row">
              {actions.map((action) => (
                <ActionLink key={`${action.label}-${action.href}`} {...action} />
              ))}
            </div>
          ) : null}

          {highlights.length > 0 ? (
            <ul className="bullet-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <aside className="hero__panel">
          {asideTitle ? <p className="panel__label">{asideTitle}</p> : null}
          {asideItems.length > 0 ? (
            <ul className="check-list">
              {asideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </aside>
      </section>

      {cards.length > 0 ? (
        <section className="section-grid" aria-label={`${title} details`}>
          {cards.map((card) => (
            <article className="feature-card" key={card.title}>
              <p className="card-label">Section</p>
              <h2>{card.title}</h2>
              <p>{card.text}</p>

              {card.points ? (
                <ul className="feature-card__list">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {children ? <section className="feature-page__content">{children}</section> : null}
    </main>
  );
}
