import { queryOptions } from '@tanstack/react-query';
import { getMySessions, getProfile } from '@/services/profile/profile.service';
import { profileKeys } from './profile.keys';

export const profileQueryOptions = queryOptions({
  queryKey: profileKeys.current(),
  queryFn: getProfile,
  staleTime: 5 * 60 * 1000,
  retry: false,
});

export const sessionsQueryOptions = queryOptions({
  queryKey: profileKeys.sessions(),
  queryFn: getMySessions,
  staleTime: 60 * 1000,
});
