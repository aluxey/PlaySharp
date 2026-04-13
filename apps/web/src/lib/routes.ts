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

export const publicNavItems = [
  { label: 'Home', href: routes.home },
  { label: 'Lessons', href: routes.lessons },
  { label: 'Quiz', href: routes.quiz },
] as const;

export function normalizeAuthRedirectPath(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  const normalizedPath = path.trim();

  if (!normalizedPath.startsWith('/') || normalizedPath.startsWith('//')) {
    return null;
  }

  if (
    normalizedPath === routes.login ||
    normalizedPath.startsWith(`${routes.login}?`) ||
    normalizedPath === routes.register ||
    normalizedPath.startsWith(`${routes.register}?`)
  ) {
    return null;
  }

  return normalizedPath;
}

function buildAuthRoute(basePath: typeof routes.login | typeof routes.register, nextPath?: string | null) {
  const normalizedNextPath = normalizeAuthRedirectPath(nextPath);

  if (!normalizedNextPath) {
    return basePath;
  }

  const params = new URLSearchParams({ next: normalizedNextPath });
  return `${basePath}?${params.toString()}`;
}

export function buildLoginRoute(nextPath?: string | null) {
  return buildAuthRoute(routes.login, nextPath);
}

export function buildRegisterRoute(nextPath?: string | null) {
  return buildAuthRoute(routes.register, nextPath);
}

export function resolvePostAuthRedirect(nextPath: string | null | undefined, fallbackPath: string) {
  return normalizeAuthRedirectPath(nextPath) ?? fallbackPath;
}

export function lessonThemeRoute(game: ContentGameName, themeSlug: string) {
  return `${routes.lessons}/${game}/${themeSlug}`;
}

export function lessonDetailRoute(game: ContentGameName, themeSlug: string, lessonSlug: string) {
  return `${lessonThemeRoute(game, themeSlug)}/${lessonSlug}`;
}
