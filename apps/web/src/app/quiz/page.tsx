import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: 'Question state',
    text: 'The question must appear immediately, with answer choices that are easy to scan.',
    points: ['3 to 5 choices', 'Optional scenario visual', 'Clear validation action'],
  },
  {
    title: 'Feedback state',
    text: 'After submission, the user should see the result, the explanation, and the reasoning behind it.',
    points: ['Correct or incorrect result', 'Why the answer is right', 'Why other options fail'],
  },
  {
    title: 'Completion state',
    text: 'When the quiz ends, the product should surface the result and route the user to the next best step.',
    points: ['Score summary', 'Weak themes', 'Continue or retry action'],
  },
] as const;

export default function QuizPage() {
  return (
    <FeaturePage
      eyebrow="Learning loop"
      title="Quiz"
      description="The quiz experience is the core of the product. It needs to be fast, readable, and mechanically obvious from the first screen to the last feedback step."
      status="Critical path"
      actions={[
        { label: 'Back to dashboard', href: routes.dashboard, variant: 'primary' },
        { label: 'Browse lessons', href: routes.lessons },
      ]}
      highlights={[
        'Immediate feedback after each answer',
        'No friction between questions',
        'Explanation-first design',
      ]}
      asideTitle="Quiz rules"
      asideItems={[
        'Question visible immediately',
        'One clear validate action',
        'Next step is obvious after feedback',
      ]}
      cards={cards}
    />
  );
}
