import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: 'Weekly trend',
    text: 'Show the user whether they are improving over a short window, not just their all-time average.',
    points: ['7-day view', '30-day view', 'Simple trend line'],
  },
  {
    title: 'Theme breakdown',
    text: 'Surface the most useful theme-level signals so the user knows what to practice next.',
    points: ['Strong themes', 'Weak themes', 'Theme-level accuracy'],
  },
  {
    title: 'Error patterns',
    text: 'A compact error review helps the user understand recurring mistakes without a dense analytics surface.',
    points: ['Frequent miss types', 'Recent mistakes', 'Recommended review path'],
  },
] as const;

export default function ProgressPage() {
  return (
    <FeaturePage
      eyebrow="Progress overview"
      title="Progress"
      description="Progress is the retention layer of the product. It should make improvement visible at a glance and push the user toward the next practice loop."
      status="Analytics-ready"
      actions={[
        { label: 'Back to dashboard', href: routes.dashboard, variant: 'primary' },
        { label: 'Open quiz', href: routes.quiz },
      ]}
      highlights={['Keep the graph light', 'Focus on weak themes', 'Tie progress to action']}
      asideTitle="What matters most"
      asideItems={['Trend over time', 'Theme-level performance', 'Actionable next step']}
      cards={cards}
    />
  );
}
