'use client';

import { useEffect, useState } from 'react';
import { bootstrapAuth } from '@/lib/auth/auth.bootstrap';
import { PageLoader } from '../feedback/page-loader';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    bootstrapAuth().finally(() => {
      if (mounted) {
        setInitialized(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!initialized) {
    return <PageLoader />;
  }
  return children;
}
