import { FeaturePage } from '../../components/feature-page';
import { routes } from '../../lib/routes';

const cards = [
  {
    title: 'Account summary',
    text: 'A simple profile surface should show who the user is and how they access the product.',
    points: ['User identity', 'Role or plan', 'Primary preferences'],
  },
  {
    title: 'Activity history',
    text: 'Provide a clean trail of recent activity so the user can reconnect with the learning loop.',
    points: ['Last sessions', 'Recent scores', 'Recent lesson visits'],
  },
  {
    title: 'Account actions',
    text: 'Keep account management minimal for V1 and avoid mixing it with product settings.',
    points: ['Update profile', 'Sign out', 'Future premium entry point'],
  },
] as const;

export default function ProfilePage() {
  return (
    <FeaturePage
      eyebrow="User account"
      title="Profile"
      description="The profile screen should stay lightweight in V1. It exists to anchor identity, recent activity, and the path back into practice."
      status="Lightweight"
      actions={[
        { label: 'Back to dashboard', href: routes.dashboard, variant: 'primary' },
        { label: 'Open progress', href: routes.progress },
      ]}
      highlights={[
        'Keep it simple',
        'Focus on identity and history',
        'Do not overload with settings',
      ]}
      asideTitle="V1 rule"
      asideItems={[
        'No premium flow yet',
        'No dense settings surface',
        'Fast access back to the product loop',
      ]}
      cards={cards}
    />
  );
}
