import { PageLoadingState } from '../../components';

export default function Loading() {
  return (
    <PageLoadingState
      title="Loading admin inventory"
      description="Fetching the content manifests and admin reference data."
    />
  );
}
