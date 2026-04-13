import { StatePanel } from '../../components';
import { getGameContent } from '../../lib/api';
import { routes } from '../../lib/routes';
import {
  buildLessonCards,
  buildThemeLinks,
  type LessonCard,
  type LessonThemeLink,
} from './catalog';
import { LessonsClient } from './lessons-client';

export const dynamic = 'force-dynamic';

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
          actionHref={routes.dashboard}
          tone="error"
        />
      </div>
    );
  }

  const lessons: LessonCard[] = [];
  const themes: LessonThemeLink[] = [];

  if (pokerContent.data) {
    lessons.push(...buildLessonCards(pokerContent.data));
    themes.push(...buildThemeLinks(pokerContent.data));
  }

  if (blackjackContent.data) {
    lessons.push(...buildLessonCards(blackjackContent.data));
    themes.push(...buildThemeLinks(blackjackContent.data));
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lessons"
          title="No lessons available"
          description="The content API returned an empty lesson catalog. Populate content JSON and reseed the database."
          actionLabel="Open dashboard"
          actionHref={routes.dashboard}
        />
      </div>
    );
  }

  return <LessonsClient lessons={lessons} themes={themes} />;
}
