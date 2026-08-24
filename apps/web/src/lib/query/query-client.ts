import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/api-error';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,

        retry: (failureCount, error) => {
          if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
            return false;
          }

          return failureCount < 2;
        },

        staleTime: 5 * 60 * 1000,
      },

      mutations: {
        retry: 0,
      },
    },
  });
}
