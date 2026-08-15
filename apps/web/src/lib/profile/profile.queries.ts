import { queryOptions } from '@tanstack/react-query';
import { getProfile } from '@/services/profile/profile.service';
import { profileKeys } from './profile.keys';

export const profileQueryOptions = queryOptions({
  queryKey: profileKeys.current(),
  queryFn: getProfile,
});
