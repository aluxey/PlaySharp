'use client';

import { useMemo, useState } from 'react';
import { Filter, Lock, Search } from 'lucide-react';

import { ContentCard } from '../../components/premium-cards';

export type LessonCard = {
  id: string;
  title: string;
  description: string;
  game: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  locked?: boolean;
  tags: ReadonlyArray<string>;
};

type LessonsClientProps = {
  lessons: ReadonlyArray<LessonCard>;
};

export function LessonsClient({ lessons }: LessonsClientProps) {
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Master Your Game
            </h1>
            <p className="text-lg text-foreground-secondary max-w-2xl">
              Lessons synced depuis l'API : poker et blackjack, par thème et niveau.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary" />
              <input
                type="text"
                placeholder="Search lessons..."
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
                  <ContentCard
                    title={lesson.title}
                    description={lesson.description}
                    image={lesson.game === 'poker' ? undefined : undefined}
                    tags={lesson.tags}
                    difficulty={lesson.difficulty}
                    duration={lesson.duration}
                    locked={lesson.locked}
                    onClick={() => {
                      if (lesson.locked) return;
                      window.location.href = `/lessons/${lesson.id}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.some((l) => l.locked) && (
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
        )}
      </div>
    </div>
  );
}
