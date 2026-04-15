import Link from 'next/link';
import { ArrowRight, BookOpen, Check, Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react';

import { getAuthState } from '../lib/auth-state';
import { routes } from '../lib/routes';

const demoQuiz = {
  theme: 'Preflop Position',
  prompt:
    'You are on the button in a soft cash game and both blinds are passive. What changes first?',
  answer: 'Raise a wider range',
  explanation:
    'Button position lets you steal more uncontested pots and play postflop with more information, so the profitable opening range expands.',
  choices: ['Raise a wider range', 'Limp most hands', 'Wait for premiums only'],
};

const comparisonCards = [
  {
    title: 'Free in V1',
    eyebrow: 'Available now',
    tone: 'border-primary/30 bg-primary/10',
    cta: 'Create account',
    href: routes.register,
    points: [
      'Daily quiz access',
      'Lesson browsing by game and theme',
      'Dashboard and progress tracking',
    ],
  },
  {
    title: 'Premium later',
    eyebrow: 'Post-V1 path',
    tone: 'border-premium/30 bg-premium/10',
    cta: 'Start with free',
    href: routes.register,
    points: [
      'Deeper lesson packs',
      'More advanced training volume',
      'Expanded coaching and analytics',
    ],
  },
] as const;

export default async function HomePage() {
  const authState = await getAuthState();

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm text-foreground-secondary">
              <Sparkles className="w-4 h-4 text-primary" />
              Study spots, track streaks, and train with live progress signals.
            </p>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Learn faster when the app remembers your game.
              </h1>
              <p className="max-w-2xl text-lg text-foreground-secondary">
                Register once, stay signed in, and let PlaySharp carry your quiz history, dashboard,
                profile, and progress across the site.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {authState.isAuthenticated ? (
                <>
                  <Link
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold"
                    href={routes.dashboard}
                  >
                    Open dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border text-foreground font-semibold"
                    href={routes.quiz}
                  >
                    Continue training
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold"
                    href={routes.register}
                  >
                    Create account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border text-foreground font-semibold"
                    href={routes.login}
                  >
                    Log in
                  </Link>
                </>
              )}
              <Link
                className="px-5 py-3 rounded-2xl text-foreground-secondary"
                href={routes.lessons}
              >
                Browse lessons
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-surface-elevated p-6 md:p-8 shadow-2xl shadow-primary/10">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-foreground">Persistent auth state</p>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Secure cookie-backed sessions keep member pages, profile data, and navigation in
                  sync after login or registration.
                </p>
              </div>
              <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <p className="font-semibold text-foreground">Quick start quiz flow</p>
                </div>
                <p className="text-sm text-foreground-secondary">
                  New accounts can jump straight into a quiz so the dashboard has real signals from
                  the first session.
                </p>
              </div>
              <div className="rounded-2xl border border-warning/20 bg-warning/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-warning" />
                  <p className="font-semibold text-foreground">Guest-friendly browsing</p>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Logged-out visitors can browse the site without seeing member-only navigation or
                  profile-only states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-18 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
              Demo quiz block
            </p>
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                See the coaching loop before you sign up.
              </h2>
              <p className="text-lg text-foreground-secondary max-w-2xl">
                The live product turns one quick spot into an answer, a correction, and a lesson
                path you can open immediately.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-surface-elevated p-6 md:p-7 shadow-xl shadow-primary/5 space-y-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                    {demoQuiz.theme}
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground mt-1">Sample decision</h3>
                </div>
                <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-sm font-medium text-success">
                  Feedback included
                </span>
              </div>

              <p className="text-foreground text-lg leading-relaxed">{demoQuiz.prompt}</p>

              <div className="grid gap-3">
                {demoQuiz.choices.map((choice) => {
                  const isCorrect = choice === demoQuiz.answer;

                  return (
                    <div
                      key={choice}
                      className={`rounded-2xl border px-4 py-4 flex items-center justify-between gap-3 ${
                        isCorrect
                          ? 'border-success/40 bg-success/10'
                          : 'border-border bg-surface hover:border-primary/20'
                      }`}
                    >
                      <span className="font-medium text-foreground">{choice}</span>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-success">
                          <Check className="w-4 h-4" />
                          Best answer
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-primary font-semibold mb-2">
                  Why it works
                </p>
                <p className="text-sm md:text-base text-foreground-secondary">
                  {demoQuiz.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-background p-6 md:p-8 shadow-xl shadow-secondary/5 space-y-5">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
              What the app remembers
            </p>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface-elevated p-5">
                <p className="text-sm text-foreground-secondary mb-1">After the answer</p>
                <p className="font-semibold text-foreground">Immediate explanation and next step</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface-elevated p-5">
                <p className="text-sm text-foreground-secondary mb-1">After the lesson click</p>
                <p className="font-semibold text-foreground">
                  Theme-specific lesson path opens from the same mistake
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface-elevated p-5">
                <p className="text-sm text-foreground-secondary mb-1">After the session</p>
                <p className="font-semibold text-foreground">
                  Dashboard and progress signals update from the attempt
                </p>
              </div>
            </div>
            <Link
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold"
              href={routes.quiz}
            >
              Open today's quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-18 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
            Free vs premium
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Start with the core loop now, layer more depth later.
          </h2>
          <p className="text-lg text-foreground-secondary">
            V1 ships the free training loop first. The premium path stays visible so the product can
            explain where expanded coaching would go without blocking the launch.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {comparisonCards.map((card) => (
            <article key={card.title} className={`rounded-[2rem] border p-6 md:p-8 ${card.tone}`}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                    {card.eyebrow}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mt-2">{card.title}</h3>
                </div>
                <Crown className="w-6 h-6 text-foreground" />
              </div>

              <div className="space-y-3 mb-8">
                {card.points.map((point) => (
                  <div key={point} className="flex items-center gap-3 text-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/80 border border-border">
                      <Check className="w-4 h-4" />
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <Link
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-background text-foreground font-semibold border border-border"
                href={card.href}
              >
                {card.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
