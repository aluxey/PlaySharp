import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: 'Account creation',
    text: 'Registration should be short and focused on getting the user into the learning loop quickly.',
    points: ['Short form', 'Account confirmation', 'Immediate next step'],
  },
  {
    title: 'Onboarding',
    text: 'The first experience after sign-up should route directly toward the quiz, not a long setup flow.',
    points: ['Choose a game', 'Start quiz', 'First feedback loop'],
  },
  {
    title: 'Retention hook',
    text: 'Registration should set up the habit, not just the account record.',
    points: ['Daily habit prompt', 'Progress visibility', 'Quick return path'],
  },
] as const;

export default function RegisterPage() {
  return (
    <FeaturePage
      eyebrow="Authentication"
      title="Create account"
      description="This is the registration scaffold. It should minimize friction and make the first quiz feel like the natural next step."
      status="Shell only"
      actions={[
        { label: 'Back home', href: routes.home, variant: 'primary' },
        { label: 'Log in', href: routes.login },
      ]}
      highlights={['Short onboarding', 'Direct path to practice', 'Habit-first UX']}
      asideTitle="Onboarding rule"
      asideItems={['No long setup flow', 'Start the habit early', 'Keep trust high']}
      cards={cards}
    />
  );
}
