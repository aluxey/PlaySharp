import { StatePanel } from '../../components';
import { getProgressOverview } from '../../lib/api';
import { ProgressClient } from './progress-client';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const overview = await getProgressOverview();

  if (overview.error) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Progress"
          title="Progress data is unavailable"
          description={overview.error.message}
          actionLabel="Open dashboard"
          actionHref="/dashboard"
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
