import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: 'Theme management',
    text: 'Admin should make it easy to create and organize themes without touching the application code.',
    points: ['Create themes', 'Assign game and level', 'Review structure'],
  },
  {
    title: 'Lesson workflow',
    text: 'Lesson creation should stay aligned with the content model and the versioned source files.',
    points: ['Draft lesson', 'Preview output', 'Publish content'],
  },
  {
    title: 'Question workflow',
    text: 'Question editing needs to be explicit about correctness, explanation, and the associated theme.',
    points: ['Choices and correctness', 'Explanation editing', 'Difficulty control'],
  },
] as const;

export default function AdminPage() {
  return (
    <FeaturePage
      eyebrow="Internal workspace"
      title="Admin"
      description="The admin surface is part of the V1 because content creation has to stay operational from the start. The goal is speed, clarity, and low maintenance."
      status="Integrated"
      actions={[
        { label: 'Back to dashboard', href: routes.dashboard, variant: 'primary' },
        { label: 'Open lessons', href: routes.lessons },
      ]}
      highlights={[
        'Manage content inside the product',
        'Preview before publishing',
        'Keep the workflow minimal',
      ]}
      asideTitle="Admin rule"
      asideItems={[
        'No separate product to maintain',
        'Content structure must stay predictable',
        'The workflow should be obvious',
      ]}
      cards={cards}
    />
  );
}
