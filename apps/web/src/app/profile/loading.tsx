import { PageLoadingState } from '../../components';

export default function Loading() {
  return (
    <PageLoadingState
      title="Loading profile"
      description="Fetching profile details, stats, and recent quiz history."
    />
  );
}
