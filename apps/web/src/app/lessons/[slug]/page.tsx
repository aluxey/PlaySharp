import { FeaturePage } from '../../../components/feature-page';
import { routes } from '../../../lib/routes';

const cards = [
  {
    title: 'Lesson summary',
    text: 'This detail page is the landing spot for a single lesson. It should be concise, readable, and tied to a specific practice outcome.',
    points: ['Core idea', 'Example situations', 'Practice recommendations'],
  },
  {
    title: 'Feedback loop',
    text: 'Every lesson should point back to the quiz engine so the user can immediately apply what they read.',
    points: ['Quick drill link', 'Related mistakes', 'Theme-level continuity'],
  },
  {
    title: 'Future state',
    text: 'The page will later be hydrated from the content model and the admin workspace.',
    points: ['CMS data', 'Versioned content sync', 'Preview mode'],
  },
] as const;

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <FeaturePage
      eyebrow="Lesson detail"
      title={`Lesson: ${slug}`}
      description="This dynamic route is a scaffold for the lesson detail experience. It gives the routing and visual structure a stable home before real content is connected."
      status="Placeholder"
      actions={[
        { label: 'Back to lessons', href: routes.lessons, variant: 'primary' },
        { label: 'Open quiz', href: routes.quiz },
      ]}
      highlights={['Single lesson view', 'Clear route structure', 'Content-ready layout']}
      asideTitle="Route contract"
      asideItems={[
        'Slug identifies the lesson',
        'Server-rendered page shell',
        'Ready for content data',
      ]}
      cards={cards}
    />
  );
}
