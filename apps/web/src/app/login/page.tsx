import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: 'Sign-in shell',
    text: 'The first version only needs a clean authentication container, not a full auth system implementation.',
    points: ['Email field', 'Password field', 'Primary submit action'],
  },
  {
    title: 'Security cues',
    text: 'Communicate trust, account safety, and reset options without clutter.',
    points: ['Password reset', 'Error state', 'Clear CTA hierarchy'],
  },
  {
    title: 'Return path',
    text: 'The screen should give the user an obvious path back to registration or the landing page.',
    points: ['Register link', 'Back home link', 'Low friction layout'],
  },
] as const;

export default function LoginPage() {
  return (
    <FeaturePage
      eyebrow="Authentication"
      title="Log in"
      description="This is the sign-in scaffold. It should feel trustworthy, minimal, and consistent with the rest of the product."
      status="Shell only"
      actions={[
        { label: 'Back home', href: routes.home, variant: 'primary' },
        { label: 'Create account', href: routes.register },
      ]}
      highlights={['Minimal auth shell', 'Trust-first presentation', 'Clear recovery path']}
      asideTitle="Auth flow"
      asideItems={['Keep fields obvious', 'Surface errors clearly', 'Avoid visual noise']}
      cards={cards}
    />
  );
}
