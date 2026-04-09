import { Award, Calendar, CreditCard, Crown, Mail, Settings, Target, Zap } from 'lucide-react';

import type { ProfileStat } from '@playsharp/shared';

import { DataCard, LogoutButton, StatePanel } from '../../components';
import { getProfileOverview } from '../../lib/api';
import { routes } from '../../lib/routes';

export const dynamic = 'force-dynamic';

function statIcon(stat: ProfileStat) {
  switch (stat.key) {
    case 'overallAccuracy':
      return <Target className="w-5 h-5" />;
    case 'quizzesCompleted':
      return <Zap className="w-5 h-5" />;
    case 'lessonsCompleted':
      return <Award className="w-5 h-5" />;
    case 'currentStreak':
      return <Calendar className="w-5 h-5" />;
  }
}

export default async function ProfilePage() {
  const profile = await getProfileOverview();
  const isUnauthorized = profile.error?.code === 'AUTH_UNAUTHORIZED';

  if (profile.error) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Profile"
          title={isUnauthorized ? 'Log in to view your profile' : 'Profile data is unavailable'}
          description={profile.error.message}
          actionLabel={isUnauthorized ? 'Log in' : 'Open dashboard'}
          actionHref={isUnauthorized ? routes.login : routes.dashboard}
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

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
              {user.initials}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{user.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-premium/10 border border-premium/30 rounded-lg text-premium text-sm font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {user.planLabel}
                </span>
                <span className="text-foreground-secondary">
                  Member since {user.memberSinceLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Performance Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <DataCard
                    key={stat.key}
                    label={stat.label}
                    value={stat.value}
                    icon={statIcon(stat)}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Quiz Scores</h2>
              {recentQuizScores.length === 0 ? (
                <StatePanel
                  title="No quiz history yet"
                  description="Start a few quizzes and the latest results will appear here."
                />
              ) : (
                <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
                  {recentQuizScores.map((quiz, index) => (
                    <div
                      key={`${quiz.name}-${quiz.date}`}
                      className={`p-6 flex items-center justify-between ${
                        index !== recentQuizScores.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{quiz.name}</h3>
                        <p className="text-sm text-foreground-secondary">{quiz.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {quiz.score}/{quiz.total}
                        </p>
                        <p className="text-sm text-foreground-secondary">
                          {Math.round((quiz.score / quiz.total) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Achievements</h2>
              {achievements.length === 0 ? (
                <StatePanel
                  title="No achievements unlocked"
                  description="Milestones will appear once the profile API starts returning tracked unlocks."
                />
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.name}
                      className={`p-6 rounded-2xl border text-center ${
                        achievement.unlocked
                          ? 'bg-surface-elevated border-primary/30'
                          : 'bg-surface border-border opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <p className="font-medium text-foreground text-sm">{achievement.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account Details
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-foreground-secondary mb-1">Email</p>
                  <p className="text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-foreground-secondary mb-1">Member Since</p>
                  <p className="text-foreground">{user.memberSinceLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-premium" />
                  <p className="text-foreground">{user.planLabel}</p>
                </div>
              </div>
            </section>

            <section className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all text-left">
                  <Settings className="w-5 h-5 text-foreground-secondary" />
                  <span className="text-foreground">Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all text-left">
                  <CreditCard className="w-5 h-5 text-foreground-secondary" />
                  <span className="text-foreground">Billing</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all text-left">
                  <Mail className="w-5 h-5 text-foreground-secondary" />
                  <span className="text-foreground">Notifications</span>
                </button>
                <LogoutButton />
              </div>
            </section>

            <section className="bg-gradient-to-br from-premium/20 to-premium/5 border border-premium/30 rounded-2xl p-6">
              <Crown className="w-8 h-8 text-premium mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{user.planLabel}</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                {user.renewalDate
                  ? `Your subscription renews on ${user.renewalDate}`
                  : 'Your subscription details will appear here once billing is connected.'}
              </p>
              <button className="w-full py-2 px-4 bg-surface-elevated border border-border text-foreground rounded-xl hover:bg-surface transition-all text-sm font-medium">
                Manage Subscription
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
