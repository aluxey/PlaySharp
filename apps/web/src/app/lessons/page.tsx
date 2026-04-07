import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: 'Theme index',
    text: 'Group lessons by game and theme so users can jump straight to the topic they need.',
    points: ['Poker themes', 'Blackjack themes', 'Level filters'],
  },
  {
    title: 'Lesson detail',
    text: 'Each lesson should focus on a single concept, explain it clearly, and point back to practice.',
    points: ['Short structure', 'Concrete examples', 'Optional drill link'],
  },
  {
    title: 'Content pipeline',
    text: 'Keep the lesson model aligned with the versioned content source and the admin workspace.',
    points: ['Repo-backed content', 'Seed-ready schema', 'Admin editing flow'],
  },
] as const;

export default function LessonsPage() {
  return (
    <FeaturePage
      eyebrow="Content browser"
      title="Lessons"
      description="Lessons should be the fastest path from repeated mistakes to a better explanation. The screen has to feel like a clean index, not a library maze."
      status="Content system"
      actions={[
        { label: 'Open dashboard', href: routes.dashboard, variant: 'primary' },
        { label: 'View quiz', href: routes.quiz },
      ]}
      highlights={[
        'Filter by game and level',
        'Jump from a weak theme to a lesson',
        'Keep the structure compact',
      ]}
      asideTitle="Design intent"
      asideItems={['One topic per lesson', 'Low cognitive load', 'Clear path back to practice']}
      cards={cards}
    />
  );
}
