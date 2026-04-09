import { StatePanel } from '../../components';
import { getProgressOverview } from '../../lib/api';
import { routes } from '../../lib/routes';
import { ProgressClient } from './progress-client';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const overview = await getProgressOverview();
  const isUnauthorized = overview.error?.code === 'AUTH_UNAUTHORIZED';

  if (overview.error) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Progress"
          title={isUnauthorized ? 'Log in to view progress' : 'Progress data is unavailable'}
          description={overview.error.message}
          actionLabel={isUnauthorized ? 'Log in' : 'Open dashboard'}
          actionHref={isUnauthorized ? routes.login : routes.dashboard}
          tone="error"
        />
      </div>
    );
  }

  if (!overview.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Progress"
          title="No progress data yet"
          description="Once quiz attempts and lesson activity are available, this page will surface the trend lines and coaching recommendations."
          actionLabel="Open lessons"
          actionHref="/lessons"
        />
      </div>
    );
  }

  return <ProgressClient overview={overview.data} />;
}
