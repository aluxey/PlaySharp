'use client';

import Link from 'next/link';
import { ArrowRight, Award, Clock, Flame, Target, TrendingUp, Zap } from 'lucide-react';

import { routes } from '../../lib/routes';
import {
  ActionCard,
  ContentCard,
  DataCard,
  HeroCard,
  ProgressBar,
} from '../../components/premium-cards';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, Alex</h1>
              <Flame className="w-8 h-8 text-warning" />
            </div>
            <p className="text-foreground-secondary">
              You're on a 7-day streak. Keep the momentum going! 🔥
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCard
              label="Daily Streak"
              value="7"
              icon={<Flame className="w-5 h-5" />}
              change="+1"
              positive
            />
            <DataCard
              label="Accuracy Rate"
              value="84%"
              icon={<Target className="w-5 h-5" />}
              change="+3%"
              positive
            />
            <DataCard label="Quiz Completed" value="156" icon={<Zap className="w-5 h-5" />} />
            <DataCard label="Lessons Done" value="23" icon={<Award className="w-5 h-5" />} />
          </div>

          <HeroCard
            title="Today's Training Focus"
            description="Continue where you left off"
            icon={<Target className="w-8 h-8" />}
            gradient
            action={
              <Link
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-medium flex items-center gap-2"
                href={routes.quiz}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          >
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <ActionCard
                title="Quick Quiz"
                description="5 questions on Pre-Flop Strategy"
                icon={<Zap className="w-8 h-8" />}
                variant="primary"
                onClick={() => (window.location.href = routes.quiz)}
              />
              <ActionCard
                title="Continue Lesson"
                description="GTO Basics - 60% complete"
                icon={<Clock className="w-8 h-8" />}
                variant="secondary"
                onClick={() => (window.location.href = routes.lessons)}
              />
            </div>
          </HeroCard>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Areas to Improve</h2>
              <p className="text-foreground-secondary">Focus on these weak themes</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { theme: 'Post-Flop Play', accuracy: 62, questions: 24 },
              { theme: 'Pot Odds Calculation', accuracy: 71, questions: 18 },
              { theme: 'Bluff Detection', accuracy: 68, questions: 31 },
            ].map((item, index) => (
              <div
                key={item.theme}
                className="bg-surface-elevated border border-border rounded-2xl p-6 hover:border-warning/30 transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{item.theme}</h3>
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
                  {item.questions} questions attempted
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Recommended for You</h2>
              <p className="text-foreground-secondary">Based on your performance</p>
            </div>
            <Link
              className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-2"
              href={routes.lessons}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContentCard
              title="Advanced Post-Flop Strategy"
              description="Master the art of playing after the flop with GTO principles"
              tags={['Poker', 'Strategy']}
              difficulty="advanced"
              duration="45 min"
              onClick={() => (window.location.href = routes.lessons)}
            />
            <ContentCard
              title="Pot Odds Mastery"
              description="Learn to calculate pot odds quickly and make better decisions"
              tags={['Poker', 'Math']}
              difficulty="intermediate"
              duration="30 min"
              onClick={() => (window.location.href = routes.lessons)}
            />
            <ContentCard
              title="Reading Your Opponents"
              description="Identify betting patterns and detect bluffs effectively"
              tags={['Poker', 'Psychology']}
              difficulty="advanced"
              duration="50 min"
              locked
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Recent Activity</h2>
              <p className="text-foreground-secondary">Your training history</p>
            </div>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
            {[
              {
                type: 'Quiz',
                title: 'Pre-Flop Strategy Quiz',
                score: 8,
                total: 10,
                time: '2 hours ago',
              },
              { type: 'Lesson', title: 'GTO Basics', progress: 60, time: '5 hours ago' },
              {
                type: 'Quiz',
                title: 'Blackjack Basic Strategy',
                score: 9,
                total: 10,
                time: 'Yesterday',
              },
            ].map((activity, index) => (
              <div
                key={`${activity.title}-${index}`}
                className={`p-6 flex items-center justify-between ${index !== 2 ? 'border-b border-border' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activity.type === 'Quiz'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    {activity.type === 'Quiz' ? (
                      <Zap className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-foreground-secondary">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  {'score' in activity && (
                    <p className="font-semibold text-foreground">
                      {activity.score}/{activity.total}
                    </p>
                  )}
                  {'progress' in activity && (
                    <p className="font-semibold text-foreground">{activity.progress}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
