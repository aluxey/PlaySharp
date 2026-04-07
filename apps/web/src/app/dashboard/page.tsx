import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: "Today's action",
    text: 'Keep the habit short and obvious so the user can complete a session in a few minutes.',
    points: ['Daily quiz entry point', 'Current streak', 'Immediate next step'],
  },
  {
    title: 'Progress snapshot',
    text: 'Show the minimum useful stats without pushing the user into analysis paralysis.',
    points: ['Overall accuracy', 'Weak themes', 'Recent trend'],
  },
  {
    title: 'Recommended next move',
    text: 'Use the recent errors to route the user toward the most relevant lesson or drill.',
    points: ['Top weak theme', 'Lesson shortcut', 'Review loop'],
  },
] as const;

export default function DashboardPage() {
  return (
    <FeaturePage
      eyebrow="Post-login home"
      title="Dashboard"
      description="This is the daily operating screen for the product. It should make the next quiz obvious and keep progress visible without clutter."
      status="Foundation"
      actions={[
        { label: 'Start quiz', href: routes.quiz, variant: 'primary' },
        { label: 'Open lessons', href: routes.lessons },
      ]}
      highlights={[
        'One dominant daily CTA',
        'Fast access to weak themes',
        'Clear progress without noise',
      ]}
      asideTitle="What the first build must prove"
      asideItems={[
        'A user understands what to do next',
        'A user can return every day',
        'The UI reads well on mobile',
      ]}
      cards={cards}
    />
  );
}
