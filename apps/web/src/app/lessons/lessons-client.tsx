'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Filter, Lock, Search } from 'lucide-react';

import { ContentCard } from '../../components/premium-cards';
import { routes } from '../../lib/routes';
import type { LessonCard, LessonThemeLink } from './catalog';

type LessonsClientProps = {
  lessons: ReadonlyArray<LessonCard>;
  themes: ReadonlyArray<LessonThemeLink>;
  title?: string;
  description?: string;
  activeThemeHref?: string;
};

export function LessonsClient({
  lessons,
  themes,
  title = 'Master Your Game',
  description = 'Lessons synced from the API across poker and blackjack, organized by theme and level.',
  activeThemeHref,
}: LessonsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState<'all' | 'poker' | 'blackjack'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<
    'all' | 'beginner' | 'intermediate' | 'advanced'
  >('all');

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesSearch =
        query.length === 0 ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query);

      const matchesGame = gameFilter === 'all' || lesson.game === gameFilter;
      const matchesDifficulty =
        difficultyFilter === 'all' || lesson.difficulty === difficultyFilter;

      return matchesSearch && matchesGame && matchesDifficulty;
    });
  }, [lessons, searchQuery, gameFilter, difficultyFilter]);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h1>
            <p className="text-lg text-foreground-secondary max-w-2xl">{description}</p>
          </div>

          {themes.length > 0 ? (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                    Theme paths
                  </p>
                  <p className="text-sm text-foreground-secondary">
                    Jump straight into a specific game and theme route.
                  </p>
                </div>
                {activeThemeHref ? (
                  <Link
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    href={routes.lessons}
                  >
                    View all lessons
                  </Link>
                ) : null}
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {themes.map((theme) => {
                  const isActive = theme.href === activeThemeHref;

                  return (
                    <Link
                      key={theme.href}
                      className={`rounded-2xl border p-4 transition-all ${
                        isActive
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : 'border-border bg-surface-elevated hover:border-primary/30'
                      }`}
                      href={theme.href}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-foreground-secondary">
                            {theme.gameName}
                          </p>
                          <h2 className="font-semibold text-foreground">{theme.name}</h2>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-lg border bg-surface text-foreground-secondary">
                          {theme.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-foreground-secondary">
                        {theme.lessonCount} lesson{theme.lessonCount !== 1 ? 's' : ''} ·{' '}
                        {theme.questionCount} question{theme.questionCount !== 1 ? 's' : ''}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-8 space-y-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary" />
              <input
                type="text"
                placeholder={activeThemeHref ? 'Search this theme...' : 'Search lessons...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-elevated border border-border rounded-2xl text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-foreground-secondary" />
                <span className="text-sm text-foreground-secondary font-medium">Game:</span>
                {(['all', 'poker', 'blackjack'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setGameFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      gameFilter === filter
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-surface-elevated text-foreground-secondary hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-foreground-secondary font-medium">Level:</span>
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDifficultyFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      difficultyFilter === filter
                        ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20'
                        : 'bg-surface-elevated text-foreground-secondary hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary text-lg">
              No lessons found matching your criteria
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-foreground-secondary">
                Showing {filtered.length} lesson{filtered.length !== 1 ? 's' : ''}.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((lesson, index) => (
                <div key={lesson.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <Link className="block" href={lesson.href}>
                    <ContentCard
                      title={lesson.title}
                      description={lesson.description}
                      image={lesson.game === 'poker' ? undefined : undefined}
                      tags={lesson.tags}
                      difficulty={lesson.difficulty}
                      locked={lesson.locked}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.some((lesson) => lesson.locked) ? (
          <div className="mt-12 bg-gradient-to-br from-premium/20 via-surface-elevated to-premium/10 border border-premium/30 rounded-3xl p-8 md:p-12 text-center">
            <Lock className="w-12 h-12 text-premium mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Unlock All Premium Lessons
            </h2>
            <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
              Get unlimited access to all advanced lessons, video content, and exclusive training
              materials.
            </p>
            <button className="px-8 py-4 bg-premium text-background rounded-2xl font-medium hover:bg-premium/90 transition-all shadow-lg shadow-premium/20">
              Upgrade to Premium
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
