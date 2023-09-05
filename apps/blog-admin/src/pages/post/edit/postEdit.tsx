import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Write } from '../write/write';

export function PostEdit() {
  const { id } = useParams();

  return (
    <ErrorBoundary fallback={<div>404</div>}>
      <Write id={id} />
    </ErrorBoundary>
  );
}
