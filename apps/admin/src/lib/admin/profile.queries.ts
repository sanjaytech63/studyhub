import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  requestAdminEmailChange,
  verifyAdminEmailChange,
  resendAdminEmailChangeOtp,
  uploadAdminSelfAvatar,
  deleteAdminSelfAvatar,
  type AdminProfile,
  type UpdateAdminProfilePayload,
  type ChangeAdminPasswordPayload,
} from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';

export const adminProfileQueryKey = ['admin', 'me'] as const;

export const adminProfileQueryOptions = queryOptions({
  queryKey: adminProfileQueryKey,
  queryFn: getAdminProfile,
  staleTime: 60 * 1000,
});

export function useUpdateAdminProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<AdminProfile, Error, UpdateAdminProfilePayload>({
    mutationFn: updateAdminProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(adminProfileQueryKey, updated);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          firstName: updated.firstName,
          lastName: updated.lastName,
          avatarUrl: updated.avatarUrl,
        });
      }
    },
  });
}

export function useChangeAdminPasswordMutation() {
  return useMutation<void, Error, ChangeAdminPasswordPayload>({
    mutationFn: changeAdminPassword,
  });
}

export function useRequestAdminEmailChangeMutation() {
  return useMutation<void, Error, { newEmail: string }>({
    mutationFn: requestAdminEmailChange,
  });
}

export function useVerifyAdminEmailChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation<AdminProfile, Error, { otp: string }>({
    mutationFn: verifyAdminEmailChange,
    onSuccess: (updated) => {
      queryClient.setQueryData(adminProfileQueryKey, updated);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          email: updated.email,
        });
      }
    },
  });
}

export function useResendAdminEmailChangeOtpMutation() {
  return useMutation<void, Error, { newEmail: string }>({
    mutationFn: resendAdminEmailChangeOtp,
  });
}

export function useUploadAdminSelfAvatarMutation() {
  const queryClient = useQueryClient();
  return useMutation<AdminProfile, Error, File>({
    mutationFn: uploadAdminSelfAvatar,
    onSuccess: (updated) => {
      queryClient.setQueryData(adminProfileQueryKey, updated);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          avatarUrl: updated.avatarUrl,
        });
      }
    },
  });
}

export function useDeleteAdminSelfAvatarMutation() {
  const queryClient = useQueryClient();
  return useMutation<AdminProfile, Error, void>({
    mutationFn: deleteAdminSelfAvatar,
    onSuccess: (updated) => {
      queryClient.setQueryData(adminProfileQueryKey, updated);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          avatarUrl: null,
        });
      }
    },
  });
}
