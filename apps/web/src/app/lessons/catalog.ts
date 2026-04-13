import type { ContentGame } from '@playsharp/shared';

import { lessonDetailRoute, lessonThemeRoute } from '../../lib/routes';

export type LessonThemeLink = {
  href: string;
  name: string;
  game: ContentGame['game'];
  gameName: string;
  difficulty: ContentGame['themes'][number]['level'];
  lessonCount: number;
  questionCount: number;
};

export type LessonCard = {
  id: string;
  href: string;
  title: string;
  description: string;
  game: ContentGame['game'];
  gameName: string;
  themeSlug: string;
  themeName: string;
  difficulty: ContentGame['themes'][number]['lessons'][number]['level'];
  locked?: boolean;
  tags: ReadonlyArray<string>;
};

export function buildThemeLinks(content: ContentGame): LessonThemeLink[] {
  return content.themes.map((theme) => ({
    href: lessonThemeRoute(content.game, theme.slug),
    name: theme.name,
    game: content.game,
    gameName: content.name,
    difficulty: theme.level,
    lessonCount: theme.lessons.length,
    questionCount: theme.questions.length,
  }));
}

export function buildLessonCards(content: ContentGame, themeSlug?: string): LessonCard[] {
  return content.themes.flatMap((theme) => {
    if (themeSlug && theme.slug !== themeSlug) {
      return [];
    }

    return theme.lessons.map((lesson) => ({
      id: `${content.game}:${theme.slug}:${lesson.slug}`,
      href: lessonDetailRoute(content.game, theme.slug, lesson.slug),
      title: lesson.title,
      description: lesson.content,
      game: content.game,
      gameName: content.name,
      themeSlug: theme.slug,
      themeName: theme.name,
      difficulty: lesson.level,
      tags: [content.name, theme.name, lesson.level],
    }));
  });
}
