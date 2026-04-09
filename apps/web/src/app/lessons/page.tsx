import type { ContentLesson } from '@playsharp/shared';

import { StatePanel } from '../../components';
import { LessonsClient, type LessonCard } from './lessons-client';
import { getGameContent } from '../../lib/api';

export const dynamic = 'force-dynamic';

function mapLessons(
  game: 'poker' | 'blackjack',
  lessons: ReadonlyArray<ContentLesson>,
): LessonCard[] {
  return lessons.map((lesson) => ({
    id: lesson.slug,
    title: lesson.title,
    description: lesson.content,
    game,
    difficulty: lesson.level,
    duration: '—',
    locked: false,
    tags: [game, lesson.level],
  }));
}

export default async function LessonsPage() {
  const [pokerContent, blackjackContent] = await Promise.all([
    getGameContent('poker'),
    getGameContent('blackjack'),
  ]);
  const error = pokerContent.error ?? blackjackContent.error;

  if (error && !pokerContent.data && !blackjackContent.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lessons"
          title="Lesson catalog is unavailable"
          description={error.message}
          actionLabel="Back to dashboard"
          actionHref="/dashboard"
          tone="error"
        />
      </div>
    );
  }

  const lessons: LessonCard[] = [];

  if (pokerContent.data) {
    pokerContent.data.themes.forEach((theme) => {
      lessons.push(...mapLessons('poker', theme.lessons));
    });
  }

  if (blackjackContent.data) {
    blackjackContent.data.themes.forEach((theme) => {
      lessons.push(...mapLessons('blackjack', theme.lessons));
    });
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lessons"
          title="No lessons available"
          description="The content API returned an empty lesson catalog. Populate content JSON and reseed the database."
          actionLabel="Open dashboard"
          actionHref="/dashboard"
        />
      </div>
    );
  }

  return <LessonsClient lessons={lessons} />;
}
