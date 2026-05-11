import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Crown,
  Flame,
  Mail,
  Target,
  TrendingUp,
  UserRound,
  Zap,
} from 'lucide-react';

import { LogoutButton, ProgressBar, StatePanel } from '../../components';
import { getProfileOverview, getProgressOverview } from '../../lib/api';
import { buildLoginRoute, lessonThemeRoute, routes } from '../../lib/routes';

export const dynamic = 'force-dynamic';

function statValue(stats: ReadonlyArray<{ key: string; value: string }>, key: string) {
  return stats.find((stat) => stat.key === key)?.value ?? '0';
}

function numericStat(value: string) {
  const parsed = Number.parseInt(value.replace(/[^\d-]/g, ''), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function accuracyTone(accuracy: number) {
  if (accuracy < 50) {
    return 'text-error';
  }

  if (accuracy < 75) {
    return 'text-warning';
  }

  return 'text-success';
}

function EmptyMessage({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-xl bg-surface p-4">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-foreground-secondary">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
          href={actionHref}
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export default async function ProfilePage() {
  const [profile, progress] = await Promise.all([getProfileOverview(), getProgressOverview()]);
  const authError = profile.error ?? progress.error;

  if (authError?.code === 'AUTH_UNAUTHORIZED') {
    redirect(buildLoginRoute(routes.profile));
  }

  if (profile.error) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Profile"
          title="Profile data is unavailable"
          description={profile.error.message}
          actionLabel="Open dashboard"
          actionHref={routes.dashboard}
          tone="error"
        />
      </div>
    );
  }

  if (!profile.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Profile"
          title="No profile data yet"
          description="Once user details and learning history are available, this page will show account context, quiz history, and achievements."
          actionLabel="Open lessons"
          actionHref="/lessons"
        />
      </div>
    );
  }

  const { user, stats, recentQuizScores, achievements } = profile.data;
  const overview = progress.data;
  const overallAccuracy =
    overview?.summary.overallAccuracy ?? numericStat(statValue(stats, 'overallAccuracy'));
  const quizzesCompleted = statValue(stats, 'quizzesCompleted');
  const currentStreak =
    overview?.summary.currentStreak ?? numericStat(statValue(stats, 'currentStreak'));
  const lessonsCompleted =
    overview?.summary.totalLessons && overview.summary.totalLessons > 0
      ? `${overview.summary.lessonsCompleted}/${overview.summary.totalLessons}`
      : statValue(stats, 'lessonsCompleted');
  const questionsAnswered = overview?.summary.questionsAnswered ?? 0;
  const weeklyAccuracy = overview?.weeklyAccuracy ?? [];
  const weakThemes = overview?.themesToImprove.slice(0, 4) ?? [];
  const primaryWeakness = weakThemes[0] ?? null;
  const recurringMistakes = overview?.recurringMistakes.slice(0, 4) ?? [];
  const scoreGradient = `conic-gradient(var(--primary) ${clampPercent(overallAccuracy) * 3.6}deg, rgba(169, 177, 199, 0.14) 0deg)`;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                {user.initials}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold text-foreground md:text-3xl">
                  {user.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-secondary">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-2 text-premium">
                    <Crown className="h-4 w-4" />
                    {user.planLabel}
                  </span>
                  <span>Member since {user.memberSinceLabel}</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-48">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <div className="mb-4 flex items-center justify-between text-sm text-foreground-secondary">
              <span>Overall accuracy</span>
              <Target className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{overallAccuracy}%</p>
            <p className="mt-1 text-sm text-foreground-secondary">
              {questionsAnswered} answers tracked
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <div className="mb-4 flex items-center justify-between text-sm text-foreground-secondary">
              <span>Quizzes completed</span>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{quizzesCompleted}</p>
            <p className="mt-1 text-sm text-foreground-secondary">Latest practice rounds</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <div className="mb-4 flex items-center justify-between text-sm text-foreground-secondary">
              <span>Daily streak</span>
              <Flame className="h-5 w-5 text-warning" />
            </div>
            <p className="text-3xl font-bold text-foreground">{currentStreak} days</p>
            <p className="mt-1 text-sm text-foreground-secondary">Consistency signal</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <div className="mb-4 flex items-center justify-between text-sm text-foreground-secondary">
              <span>Lessons completed</span>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{lessonsCompleted}</p>
            <p className="mt-1 text-sm text-foreground-secondary">Catalog progress</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                  Player snapshot
                </p>
                <h2 className="mt-2 text-xl font-bold text-foreground">Read your game fast</h2>
              </div>
              <UserRound className="h-6 w-6 text-primary" />
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div
                className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full p-3"
                style={{ background: scoreGradient }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-surface-elevated">
                  <span className={`text-4xl font-bold ${accuracyTone(overallAccuracy)}`}>
                    {overallAccuracy}%
                  </span>
                  <span className="mt-1 text-sm text-foreground-secondary">accuracy</span>
                </div>
              </div>

              <div className="w-full min-w-0 space-y-4">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm text-foreground-secondary">Current focus</p>
                  {primaryWeakness ? (
                    <>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {primaryWeakness.themeName}
                      </p>
                      <div className="mt-3">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-foreground-secondary">Theme accuracy</span>
                          <span className={accuracyTone(primaryWeakness.accuracy)}>
                            {primaryWeakness.accuracy}%
                          </span>
                        </div>
                        <ProgressBar value={primaryWeakness.accuracy} variant="warning" />
                      </div>
                      <Link
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
                        href={lessonThemeRoute(primaryWeakness.game, primaryWeakness.themeSlug)}
                      >
                        Open lesson path
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-foreground-secondary">
                      Complete quizzes to reveal your weakest theme.
                    </p>
                  )}
                </div>
                {overview?.recommendation ? (
                  <p className="text-sm leading-6 text-foreground-secondary">
                    {overview.recommendation.description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                  Weakness map
                </p>
                <h2 className="mt-2 text-xl font-bold text-foreground">
                  Themes that need attention
                </h2>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>

            {weakThemes.length === 0 ? (
              <EmptyMessage
                title="No weak themes yet"
                description="Complete a few quizzes and this section will rank the themes that need the most work."
                actionLabel="Start a quiz"
                actionHref={routes.quiz}
              />
            ) : (
              <div className="space-y-4">
                {weakThemes.map((theme, index) => (
                  <Link
                    key={`${theme.game}-${theme.themeSlug}`}
                    className="block rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/40"
                    href={lessonThemeRoute(theme.game, theme.themeSlug)}
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {index + 1}. {theme.themeName}
                        </p>
                        <p className="text-sm text-foreground-secondary">
                          {theme.questionCount} tracked attempts
                        </p>
                      </div>
                      <span className={`text-lg font-bold ${accuracyTone(theme.accuracy)}`}>
                        {theme.accuracy}%
                      </span>
                    </div>
                    <ProgressBar value={theme.accuracy} variant="warning" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Weekly accuracy</h2>
                <p className="mt-1 text-sm text-foreground-secondary">
                  Last seven learning signals
                </p>
              </div>
              <Calendar className="h-5 w-5 text-primary" />
            </div>

            {weeklyAccuracy.length === 0 ? (
              <EmptyMessage
                title="No trend yet"
                description="Your weekly graph will fill in after more quiz attempts."
              />
            ) : (
              <div className="flex h-48 items-end gap-3 rounded-xl border border-border bg-surface p-4">
                {weeklyAccuracy.map((point) => (
                  <div key={point.day} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <div className="flex flex-1 items-end">
                      <div
                        className="w-full rounded-t-lg bg-primary/80"
                        style={{ height: `${Math.max(8, clampPercent(point.accuracy))}%` }}
                        title={`${point.day}: ${point.accuracy}%`}
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-xs font-semibold text-foreground">{point.accuracy}%</p>
                      <p className="text-xs text-foreground-secondary">{point.day}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Recent quiz scores</h2>
                <p className="mt-1 text-sm text-foreground-secondary">Latest completed rounds</p>
              </div>
              <Zap className="h-5 w-5 text-primary" />
            </div>

            {recentQuizScores.length === 0 ? (
              <EmptyMessage
                title="No quiz history yet"
                description="Start a few quizzes and the latest results will appear here."
              />
            ) : (
              <div className="space-y-3">
                {recentQuizScores.map((quiz) => {
                  const score = Math.round((quiz.score / quiz.total) * 100);

                  return (
                    <div
                      key={`${quiz.name}-${quiz.date}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{quiz.name}</p>
                          <p className="text-sm text-foreground-secondary">{quiz.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            {quiz.score}/{quiz.total}
                          </p>
                          <p className={`text-sm ${accuracyTone(score)}`}>{score}%</p>
                        </div>
                      </div>
                      <ProgressBar value={score} variant={score >= 70 ? 'success' : 'warning'} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Mistake details</h2>
                <p className="mt-1 text-sm text-foreground-secondary">
                  Repeated misses that explain the weak spots above
                </p>
              </div>
              <AlertCircle className="h-5 w-5 text-error" />
            </div>

            {recurringMistakes.length === 0 ? (
              <EmptyMessage
                title="No recurring mistakes yet"
                description="Repeated wrong answers will appear here once the API has enough history."
              />
            ) : (
              <div className="space-y-3">
                {recurringMistakes.map((mistake) => (
                  <div
                    key={`${mistake.themeName}-${mistake.questionSlug}`}
                    className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[1fr_auto]"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{mistake.label}</p>
                      <p className="mt-1 text-sm text-foreground-secondary">
                        {mistake.themeName} - Last seen {mistake.lastSeen}
                      </p>
                    </div>
                    <div className="flex items-center justify-start sm:justify-end">
                      <span className="rounded-lg border border-error/30 bg-error/10 px-3 py-1 text-sm font-semibold text-error">
                        {mistake.occurrences} misses
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Profile details</h2>
                <p className="mt-1 text-sm text-foreground-secondary">Account and milestones</p>
              </div>
              <Award className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-5">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                  <span className="text-foreground-secondary">Email</span>
                  <span className="truncate text-right text-foreground">{user.email}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                  <span className="text-foreground-secondary">Member since</span>
                  <span className="text-right text-foreground">{user.memberSinceLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground-secondary">Plan</span>
                  <span className="text-right text-premium">{user.planLabel}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Milestones</h3>
                <div className="grid gap-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.name}
                      className={`flex items-center justify-between rounded-xl border p-3 ${
                        achievement.unlocked
                          ? 'border-primary/30 bg-primary/10'
                          : 'border-border bg-surface opacity-70'
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">
                        {achievement.name}
                      </span>
                      <span className="text-sm text-foreground-secondary">
                        {achievement.unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {progress.error ? (
          <StatePanel
            eyebrow="Progress"
            title="Progress details are unavailable"
            description={progress.error.message}
            actionLabel="Open dashboard"
            actionHref={routes.dashboard}
            tone="error"
          />
        ) : null}
      </div>
    </div>
  );
}
