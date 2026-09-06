import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminUsers,
  getAdminUser,
  getAdminStats,
  updateAdminUser,
  deleteAdminUser,
  createAdminUser,
  getUserSessions,
  revokeUserSessions,
  uploadAdminUserAvatar,
  deleteAdminUserAvatar,
} from '@/services/users.service';
import type {
  AdminListUsersParams,
  AdminUpdateUserPayload,
  AdminUserDetail,
  CreateUserPayload,
  UserSessionSummary,
} from './users.types';

export const adminStatsQueryOptions = queryOptions({
  queryKey: ['admin', 'stats'],
  queryFn: getAdminStats,
  staleTime: 60 * 1000,
  refetchInterval: 5 * 60 * 1000,
});

export function adminUsersQueryOptions(params: AdminListUsersParams) {
  return queryOptions({
    queryKey: ['admin', 'users', params],
    queryFn: () => getAdminUsers(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function adminUserDetailQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['admin', 'users', userId],
    queryFn: () => getAdminUser(userId),
    enabled: Boolean(userId),
  });
}

export function userSessionsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['admin', 'users', userId, 'sessions'],
    queryFn: () => getUserSessions(userId),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation<AdminUserDetail, Error, CreateUserPayload>({
    mutationFn: createAdminUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation<AdminUserDetail, Error, { userId: string; payload: AdminUpdateUserPayload }>({
    mutationFn: ({ userId, payload }) => updateAdminUser(userId, payload),
    onSuccess: (updatedUser) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.setQueryData(['admin', 'users', updatedUser.id], updatedUser);
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useRevokeUserSessionsMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => revokeUserSessions(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId, 'sessions'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useUploadUserAvatarMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation<AdminUserDetail, Error, File>({
    mutationFn: (file: File) => uploadAdminUserAvatar(userId, file),
    onSuccess: (updatedUser) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.setQueryData(['admin', 'users', userId], updatedUser);
    },
  });
}

export function useDeleteUserAvatarMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation<AdminUserDetail, Error, void>({
    mutationFn: () => deleteAdminUserAvatar(userId),
    onSuccess: (updatedUser) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.setQueryData(['admin', 'users', userId], updatedUser);
    },
  });
}
