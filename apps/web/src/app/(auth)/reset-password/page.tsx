import { Suspense } from 'react';

import { Loading } from '@/components/feedback/loading-state';
import ResetPasswordForm from './components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return <Loading message="Loading password reset..." />;
}
