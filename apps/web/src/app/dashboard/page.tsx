import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Award, Flame, Target, TrendingUp, Zap } from 'lucide-react';

import { DataCard, HeroCard, ProgressBar, StatePanel } from '../../components';
import { getProfileOverview, getProgressOverview } from '../../lib/api';
import { buildLoginRoute, lessonThemeRoute, routes } from '../../lib/routes';

export const dynamic = 'force-dynamic';

function statValue(stats: ReadonlyArray<{ key: string; value: string }>, key: string) {
  return stats.find((stat) => stat.key === key)?.value ?? '0';
}

export default async function DashboardPage() {
  const [profile, overview] = await Promise.all([getProfileOverview(), getProgressOverview()]);
  const error = profile.error ?? overview.error;

  if (error?.code === 'AUTH_UNAUTHORIZED') {
    redirect(buildLoginRoute(routes.dashboard));
  }

  if (error && !profile.data && !overview.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Dashboard"
          title="Dashboard data is unavailable"
          description={error.message}
          actionLabel="Open lessons"
          actionHref={routes.lessons}
          tone="error"
        />
      </div>
    );
  }

  if (!profile.data || !overview.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Dashboard"
          title="Dashboard data is incomplete"
          description="Profile and progress responses are both required to render the live dashboard."
          actionLabel="Open progress"
          actionHref={routes.progress}
          tone="error"
        />
      </div>
    );
  }

  const firstName = profile.data.user.name.split(' ')[0] ?? profile.data.user.name;
  const quizzesCompleted = statValue(profile.data.stats, 'quizzesCompleted');
  const areasToImprove = overview.data.themesToImprove.slice(0, 3);
  const recommendationCards = overview.data.themesToImprove.slice(0, 3);
  const recentActivity = profile.data.recentQuizScores.slice(0, 3);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Welcome back, {firstName}
              </h1>
              <Flame className="w-8 h-8 text-warning" />
            </div>
            <p className="text-foreground-secondary">
              You&apos;re on a {overview.data.summary.currentStreak}-day streak. Keep the momentum
              going.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCard
              label="Daily Streak"
              value={overview.data.summary.currentStreak}
              icon={<Flame className="w-5 h-5" />}
            />
            <DataCard
              label="Accuracy Rate"
              value={`${overview.data.summary.overallAccuracy}%`}
              icon={<Target className="w-5 h-5" />}
              change={`${overview.data.summary.weeklyChange > 0 ? '+' : ''}${overview.data.summary.weeklyChange}%`}
              positive={overview.data.summary.weeklyChange >= 0}
            />
            <DataCard
              label="Quiz Completed"
              value={quizzesCompleted}
              icon={<Zap className="w-5 h-5" />}
            />
            <DataCard
              label="Lessons Done"
              value={overview.data.summary.lessonsCompleted}
              icon={<Award className="w-5 h-5" />}
            />
          </div>

          <HeroCard
            title="Today's Training Focus"
            description={
              overview.data.recommendation?.description ??
              'Open a quick quiz and keep the streak alive.'
            }
            icon={<Target className="w-8 h-8" />}
            gradient
            action={
              <Link
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-medium flex items-center gap-2"
                href={overview.data.recommendation?.href ?? routes.quiz}
              >
                {overview.data.recommendation?.actionLabel ?? 'Open quiz'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          >
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Link
                className="block rounded-2xl border border-primary/30 bg-primary/10 p-6 transition-all hover:bg-primary/20 shadow-lg"
                href={routes.quiz}
              >
                <div className="mb-3 text-foreground">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Quick Quiz</h3>
                <p className="text-sm text-foreground-secondary">
                  Submit a live attempt and refresh the progress signals.
                </p>
              </Link>
              <Link
                className="block rounded-2xl border border-secondary/30 bg-secondary/10 p-6 transition-all hover:bg-secondary/20 shadow-lg"
                href={routes.lessons}
              >
                <div className="mb-3 text-foreground">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Review Lessons</h3>
                <p className="text-sm text-foreground-secondary">
                  Open the lesson library and reinforce the weakest themes first.
                </p>
              </Link>
            </div>
          </HeroCard>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Areas to Improve</h2>
              <p className="text-foreground-secondary">
                Live weak-theme signals from your attempts
              </p>
            </div>
          </div>

          {areasToImprove.length === 0 ? (
            <StatePanel
              title="No weak themes yet"
              description="Complete a few quizzes and the dashboard will rank the themes that need the most work."
              actionLabel="Start a quiz"
              actionHref={routes.quiz}
            />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {areasToImprove.map((item, index) => (
                <Link
                  key={`${item.game}-${item.themeSlug}`}
                  href={lessonThemeRoute(item.game, item.themeSlug)}
                  className="block bg-surface-elevated border border-border rounded-2xl p-6 hover:border-warning/30 transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{item.themeName}</h3>
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground-secondary">Accuracy</span>
                      <span className="text-sm font-semibold text-warning">{item.accuracy}%</span>
                    </div>
                    <ProgressBar value={item.accuracy} variant="warning" />
                  </div>
                  <p className="text-xs text-foreground-secondary">
                    {item.questionCount} tracked attempts
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Recommended for You</h2>
              <p className="text-foreground-secondary">Generated from your current progress data</p>
            </div>
            <Link
              className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-2"
              href={routes.lessons}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recommendationCards.length === 0 ? (
            <StatePanel
              title="No recommendations yet"
              description="Complete more attempts to generate theme-level recommendations."
              actionLabel="Open quiz"
              actionHref={routes.quiz}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendationCards.map((item) => (
                <Link
                  key={`${item.game}-${item.themeSlug}`}
                  href={lessonThemeRoute(item.game, item.themeSlug)}
                  className="block"
                >
                  <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-foreground">Improve {item.themeName}</h3>
                        <span className="text-xs px-2 py-1 rounded-lg border bg-warning/10 text-warning border-warning/30">
                          {item.accuracy}% accuracy
                        </span>
                      </div>
                      <p className="text-foreground-secondary text-sm mb-4">
                        Practice {item.themeName} again and raise the trend from{' '}
                        {item.improvement > 0 ? '+' : ''}
                        {item.improvement}%.
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-surface rounded-lg text-foreground-secondary">
                          {item.game}
                        </span>
                        <span className="text-xs px-2 py-1 bg-surface rounded-lg text-foreground-secondary">
                          {item.questionCount} attempts
                        </span>
                        <span className="text-xs text-foreground-secondary ml-auto">
                          Open lesson path
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Recent Activity</h2>
              <p className="text-foreground-secondary">
                Latest quiz results from your profile feed
              </p>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <StatePanel
              title="No recent activity yet"
              description="Your submitted quiz attempts will appear here once the profile feed has history."
              actionLabel="Start a quiz"
              actionHref={routes.quiz}
            />
          ) : (
            <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
              {recentActivity.map((activity, index) => (
                <div
                  key={`${activity.name}-${activity.date}`}
                  className={`p-6 flex items-center justify-between ${
                    index !== recentActivity.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{activity.name}</p>
                      <p className="text-sm text-foreground-secondary">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {activity.score}/{activity.total}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      {Math.round((activity.score / activity.total) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
