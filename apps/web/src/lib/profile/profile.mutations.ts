import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changePassword, updateProfile } from '@/services/profile/profile.service';
import type { ChangePasswordFormValues } from './change-password.schema';
import type { Profile, UpdateProfilePayload } from './profile.types';
import { profileKeys } from './profile.keys';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<Profile, Error, UpdateProfilePayload>({
    mutationKey: profileKeys.update(),
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.current(), updatedProfile);
      void queryClient.invalidateQueries({
        queryKey: profileKeys.current(),
      });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation<void, Error, ChangePasswordFormValues>({
    mutationKey: profileKeys.changePassword(),
    mutationFn: changePassword,
  });
}
