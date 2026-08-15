import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /*
         * Don't immediately refetch every time
         * the user switches browser tabs.
         */
        refetchOnWindowFocus: false,

        /*
         * Retry transient server/network failures.
         */
        retry: 2,

        /*
         * Profile/user data can stay fresh for 5 minutes.
         */
        staleTime: 5 * 60 * 1000,
      },

      mutations: {
        retry: 0,
      },
    },
  });
}
