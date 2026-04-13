import { redirect } from 'next/navigation';

import { StatePanel } from '../../../../components';
import { getLessonBySlug } from '../../../../lib/api';
import { lessonDetailRoute, routes } from '../../../../lib/routes';

export const dynamic = 'force-dynamic';

export default async function LegacyLessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

  if (lesson.error) {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lesson detail"
          title="Lesson data is unavailable"
          description={lesson.error.message}
          actionLabel="Back to lessons"
          actionHref={routes.lessons}
          tone="error"
        />
      </main>
    );
  }

  if (!lesson.data) {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Lesson detail"
          title="Lesson not found"
          description="This slug does not match any lesson in the live content catalog."
          actionLabel="Back to lessons"
          actionHref={routes.lessons}
        />
      </main>
    );
  }

  redirect(lessonDetailRoute(lesson.data.game, lesson.data.themeSlug, lesson.data.lesson.slug));
}
