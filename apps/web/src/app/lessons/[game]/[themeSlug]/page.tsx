import { StatePanel } from '../../../../components';
import { getGameContent } from '../../../../lib/api';
import { lessonThemeRoute, routes } from '../../../../lib/routes';
import { buildLessonCards, buildThemeLinks } from '../../catalog';
import { LessonsClient } from '../../lessons-client';

export const dynamic = 'force-dynamic';

export default async function ThemeLessonsPage({
  params,
}: {
  params: Promise<{ game: string; themeSlug: string }>;
}) {
  const { game, themeSlug } = await params;

  if (game !== 'poker' && game !== 'blackjack') {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lessons"
          title="Unknown game"
          description={`The route does not match a supported game: ${game}.`}
          actionLabel="Open all lessons"
          actionHref={routes.lessons}
        />
      </div>
    );
  }

  const content = await getGameContent(game);

  if (content.error && !content.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lessons"
          title="Theme lessons are unavailable"
          description={content.error.message}
          actionLabel="Open all lessons"
          actionHref={routes.lessons}
          tone="error"
        />
      </div>
    );
  }

  if (!content.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lessons"
          title="Game catalog not found"
          description="The selected game catalog is missing from the live content API."
          actionLabel="Open all lessons"
          actionHref={routes.lessons}
        />
      </div>
    );
  }

  const theme = content.data.themes.find((entry) => entry.slug === themeSlug);

  if (!theme) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lessons"
          title="Theme not found"
          description="This game route exists, but the requested theme slug was not found in the catalog."
          actionLabel="Open all lessons"
          actionHref={routes.lessons}
        />
      </div>
    );
  }

  return (
    <LessonsClient
      activeThemeHref={lessonThemeRoute(content.data.game, theme.slug)}
      description={`${content.data.name} pathway with ${theme.lessons.length} lesson${theme.lessons.length !== 1 ? 's' : ''} and ${theme.questions.length} practice question${theme.questions.length !== 1 ? 's' : ''}.`}
      lessons={buildLessonCards(content.data, theme.slug)}
      themes={buildThemeLinks(content.data)}
      title={theme.name}
    />
  );
}
