import { PageLoadingState } from '../../components';

export default function Loading() {
  return (
    <PageLoadingState
      title="Loading quiz"
      description="Fetching the daily quiz contract from the API."
    />
  );
}
