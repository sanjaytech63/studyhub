import { ErrorState } from './error-state';
import { getApiErrorMessage } from '@/lib/api/api-error';

interface ApiErrorStateProps {
  readonly error: unknown;
  readonly onRetry?: () => void;
  readonly title?: string;
}

export function ApiErrorState({
  error,
  onRetry,
  title = 'Unable to load data',
}: ApiErrorStateProps) {
  return (
    <ErrorState
      title={title}
      message={getApiErrorMessage(
        error,
        'We were unable to load this information. Please try again.',
      )}
      onRetry={onRetry}
    />
  );
}
