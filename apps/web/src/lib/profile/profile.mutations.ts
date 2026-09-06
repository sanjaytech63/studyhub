import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  changePassword,
  deleteAvatar,
  requestEmailChange,
  resendEmailChangeOtp,
  revokeMyOtherSessions,
  revokeMySession,
  updateProfile,
  uploadAvatar,
  verifyEmailChange,
} from '@/services/profile/profile.service';
import type { ChangePasswordFormValues } from './change-password.schema';
import type { Profile, UpdateProfilePayload } from './profile.types';
import type {
  ChangeEmailPayload,
  ResendEmailChangePayload,
  VerifyEmailChangePayload,
} from './sessions.types';
import { profileKeys } from './profile.keys';
import { useAuthStore } from '@/store/auth.store';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<Profile, Error, UpdateProfilePayload>({
    mutationKey: profileKeys.update(),
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.current(), updatedProfile);
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation<void, Error, ChangePasswordFormValues>({
    mutationKey: profileKeys.changePassword(),
    mutationFn: changePassword,
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: revokeMySession,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.sessions() });
    },
  });
}

export function useRevokeOtherSessionsMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: revokeMyOtherSessions,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.sessions() });
    },
  });
}

export function useRequestEmailChangeMutation() {
  return useMutation<void, Error, ChangeEmailPayload>({
    mutationFn: requestEmailChange,
  });
}

export function useVerifyEmailChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, VerifyEmailChangePayload>({
    mutationFn: verifyEmailChange,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

export function useResendEmailChangeOtpMutation() {
  return useMutation<void, Error, ResendEmailChangePayload>({
    mutationFn: resendEmailChangeOtp,
  });
}

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();
  return useMutation<Profile, Error, File>({
    mutationFn: uploadAvatar,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.current(), updatedProfile);
      useAuthStore.getState().updateUser({ avatarUrl: updatedProfile.avatarUrl });
      void queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

export function useDeleteAvatarMutation() {
  const queryClient = useQueryClient();
  return useMutation<Profile, Error, void>({
    mutationFn: deleteAvatar,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.current(), updatedProfile);
      useAuthStore.getState().updateUser({ avatarUrl: null });
      void queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}
