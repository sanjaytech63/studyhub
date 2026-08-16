import { Suspense } from 'react';
import { Loading } from '@/components/feedback/loading-state';
import VerifyOtpForm from './components/verify-otp-form';

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpLoading />}>
      <VerifyOtpForm />
    </Suspense>
  );
}

function VerifyOtpLoading() {
  return <Loading message="Loading verify otp..." />;
}
