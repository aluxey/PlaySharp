'use client';

import { AlertCircle, Calendar, Lightbulb, Target, TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ProgressOverview } from '@playsharp/shared';

import { StatePanel } from '../../components/page-state';
import { DataCard, ProgressBar } from '../../components/premium-cards';

export function ProgressClient({ overview }: { overview: ProgressOverview }) {
  const summary = overview.summary;

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Your Progress</h1>
            <p className="text-lg text-foreground-secondary">
              Live coaching signals from the API contract, including trend lines, weak themes, and recurring errors.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DataCard
              label="Overall Accuracy"
              value={`${summary.overallAccuracy}%`}
              icon={<Target className="w-5 h-5" />}
              change={`${summary.weeklyChange > 0 ? '+' : ''}${summary.weeklyChange}%`}
              positive={summary.weeklyChange >= 0}
            />
            <DataCard
              label="Questions Answered"
              value={summary.questionsAnswered}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <DataCard
              label="Current Streak"
              value={`${summary.currentStreak} days`}
              icon={<Calendar className="w-5 h-5" />}
            />
            <DataCard
              label="Lessons Completed"
              value={`${summary.lessonsCompleted}/${summary.totalLessons}`}
              icon={<Target className="w-5 h-5" />}
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Weekly Accuracy Trend</h2>
          <div className="bg-surface-elevated border border-border rounded-3xl p-6 md:p-8">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[...overview.weeklyAccuracy]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(169, 177, 199, 0.1)" />
                <XAxis dataKey="day" stroke="#A9B1C7" tick={{ fill: '#A9B1C7' }} />
                <YAxis stroke="#A9B1C7" tick={{ fill: '#A9B1C7' }} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A2238',
                    border: '1px solid rgba(169, 177, 199, 0.15)',
                    borderRadius: '12px',
                    color: '#F5F7FB',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#4DA3FF"
                  strokeWidth={3}
                  dot={{ fill: '#4DA3FF', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-foreground-secondary">Accuracy %</span>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Themes to Improve</h2>
              <p className="text-foreground-secondary">Weakest themes ranked by live API data</p>
            </div>
          </div>

          {overview.themesToImprove.length === 0 ? (
            <StatePanel
              title="No theme insights available"
              description="Once the content catalog and attempts have enough depth, theme-level recommendations will appear here."
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {overview.themesToImprove.map((item, index) => (
                <div
                  key={`${item.game}-${item.themeSlug}`}
                  className="bg-surface-elevated border border-border rounded-2xl p-6 hover:border-warning/30 transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.themeName}</h3>
                      <p className="text-sm text-foreground-secondary">{item.game}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp
                        className={`w-4 h-4 ${item.improvement > 0 ? 'text-success' : 'text-error'}`}
                      />
                      <span
                        className={`text-sm font-medium ${item.improvement > 0 ? 'text-success' : 'text-error'}`}
                      >
                        {item.improvement > 0 ? '+' : ''}
                        {item.improvement}%
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground-secondary">Current Accuracy</span>
                      <span className="text-sm font-semibold text-warning">{item.accuracy}%</span>
                    </div>
                    <ProgressBar value={item.accuracy} variant="warning" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-secondary">
                      {item.questionCount} tracked attempts
                    </span>
                    <a className="text-primary hover:text-primary/80 transition-colors font-medium" href="/quiz">
                      Practice Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-error" />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Recurring Mistakes</h2>
              <p className="text-foreground-secondary">Patterns extracted from the live response</p>
            </div>
          </div>

          {overview.recurringMistakes.length === 0 ? (
            <StatePanel
              title="No recurring mistakes yet"
              description="Once the API has repeated misses to surface, this section will highlight them."
            />
          ) : (
            <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
              {overview.recurringMistakes.map((item, index) => (
                <div
                  key={`${item.themeName}-${item.questionSlug}`}
                  className={`p-6 flex items-center justify-between ${index !== overview.recurringMistakes.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{item.label}</h3>
                    <p className="text-sm text-foreground-secondary">
                      {item.themeName} · Last seen: {item.lastSeen}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-error/10 border border-error/30 rounded-lg">
                    <span className="text-error font-semibold">{item.occurrences}×</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="bg-gradient-to-br from-primary/20 via-surface-elevated to-secondary/20 border border-primary/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-surface-elevated/60 backdrop-blur-sm" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Recommended Action</h2>
              </div>
              <p className="text-foreground-secondary mb-6">
                {overview.recommendation?.description ??
                  'Keep working through the lesson library to generate more coaching signals.'}
              </p>
              <a
                className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                href={overview.recommendation?.href ?? '/lessons'}
              >
                {overview.recommendation?.actionLabel ?? 'Open lessons'}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
