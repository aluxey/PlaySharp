import type { ContentGameName } from '@playsharp/shared';

export const routes = {
  home: '/',
  dashboard: '/dashboard',
  quiz: '/quiz',
  lessons: '/lessons',
  progress: '/progress',
  profile: '/profile',
  admin: '/admin',
  login: '/login',
  register: '/register',
} as const;

export const appNavItems = [
  { label: 'Dashboard', href: routes.dashboard },
  { label: 'Quiz', href: routes.quiz },
  { label: 'Lessons', href: routes.lessons },
  { label: 'Progress', href: routes.progress },
  { label: 'Profile', href: routes.profile },
] as const;

export const authNavItems = [
  { label: 'Log in', href: routes.login },
  { label: 'Register', href: routes.register },
] as const;

export function lessonThemeRoute(game: ContentGameName, themeSlug: string) {
  return `${routes.lessons}/${game}/${themeSlug}`;
}

export function lessonDetailRoute(game: ContentGameName, themeSlug: string, lessonSlug: string) {
  return `${lessonThemeRoute(game, themeSlug)}/${lessonSlug}`;
}
