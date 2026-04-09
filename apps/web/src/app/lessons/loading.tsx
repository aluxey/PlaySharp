import { PageLoadingState } from '../../components';

export default function Loading() {
  return (
    <PageLoadingState
      title="Loading lessons"
      description="Fetching the lesson catalog from the API."
    />
  );
}
