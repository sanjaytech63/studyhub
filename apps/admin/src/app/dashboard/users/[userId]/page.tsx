'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  LogOut,
  Laptop,
  Clock,
  Trash2,
  Camera,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
} from '@/components/ui/data-table';
import {
  adminUserDetailQueryOptions,
  userSessionsQueryOptions,
  useRevokeUserSessionsMutation,
  useDeleteUserMutation,
  useUploadUserAvatarMutation,
  useDeleteUserAvatarMutation,
} from '@/lib/admin/users.queries';
import { getApiErrorMessage } from '@/lib/api/api-client';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: user, isLoading: isUserLoading } = useQuery(adminUserDetailQueryOptions(userId));

  const { data: sessions, isLoading: isSessionsLoading } = useQuery(
    userSessionsQueryOptions(userId),
  );

  const [isRevokeModalOpen, setIsRevokeModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const revokeMutation = useRevokeUserSessionsMutation(userId);
  const deleteMutation = useDeleteUserMutation();
  const uploadAvatarMutation = useUploadUserAvatarMutation(userId);
  const deleteAvatarMutation = useDeleteUserAvatarMutation(userId);

  const isAvatarProcessing = uploadAvatarMutation.isPending || deleteAvatarMutation.isPending;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    try {
      const res = await uploadAvatarMutation.mutateAsync(file);
      toast.success(res?.message || "User's avatar updated successfully!");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to upload avatar.'));
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await deleteAvatarMutation.mutateAsync();
      toast.success(res?.message || "User's avatar removed successfully!");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to remove avatar.'));
    }
  };

  const handleRevokeSessions = async () => {
    try {
      const res = await revokeMutation.mutateAsync();
      toast.success(res?.message || 'All sessions have been revoked.');
      setIsRevokeModalOpen(false);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to revoke sessions.'));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await deleteMutation.mutateAsync(userId);
      toast.success(res?.message || 'User account marked as DELETED.');
      setIsDeleteModalOpen(false);
      router.push('/dashboard/users');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to delete user.'));
    }
  };

  if (isUserLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-muted/60 animate-pulse" />
        <div className="h-36 rounded-xl bg-muted/40 animate-pulse" />
        <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">User not found</h2>
        <p className="text-xs text-muted-foreground">The requested user profile does not exist.</p>
        <Link href="/dashboard/users">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Users Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/users">
          <Button variant="outline" size="iconSm" aria-label="Back to Users Directory">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground">Users / {user.id}</span>
      </div>

      {/* User Hero Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Interactive Avatar with upload controls */}
            <div className="relative group shrink-0">
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                avatarUrl={user.avatarUrl}

                isOnline={user._count.sessions > 0}
              />

              {isAvatarProcessing ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white">
                  <Loader className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload / Change Avatar"
                  aria-label="Upload / Change Avatar"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {user.firstName} {user.lastName || ''}
                </h1>
                <Badge variant={user.role.type === 'SYSTEM' ? 'system' : 'custom'}>
                  {user.role.name}
                </Badge>
                <Badge
                  variant={
                    user.status === 'ACTIVE'
                      ? 'active'
                      : user.status === 'SUSPENDED'
                        ? 'suspended'
                        : user.status === 'DELETED'
                          ? 'deleted'
                          : 'inactive'
                  }
                >
                  {user.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-mono text-muted-foreground">{user.email}</span>
                {user.avatarUrl && (
                  <button
                    type="button"
                    disabled={isAvatarProcessing}
                    onClick={handleDeleteAvatar}
                    className="inline-flex items-center gap-1 text-[11px] text-destructive/80 hover:text-destructive hover:underline transition-colors font-medium cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {user._count.sessions > 0 && (
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setIsRevokeModalOpen(true)}
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Revoke Sessions ({user._count.sessions})
              </Button>
            )}
            {user.status !== 'DELETED' && (
              <Button
                variant="outline"
                className="w-full sm:w-auto text-destructive hover:bg-destructive/10"
                onClick={() => setIsDeleteModalOpen(true)}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Deactivate User
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 3 Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Security & Verification Card */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Identity & Verification</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Email Verification</span>
              {user.emailVerifiedAt ? (
                <span className="font-mono text-emerald-400">Verified</span>
              ) : (
                <span className="font-mono text-amber-400">Pending</span>
              )}
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">OTP Verifications</span>
              <span className="font-mono text-foreground">{user._count.otpVerifications}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Active Sessions</span>
              <span className="font-mono text-foreground">{user._count.sessions}</span>
            </div>
          </div>
        </Card>

        {/* Role & Privileges Card */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Shield className="h-4 w-4 text-purple-400" />
            <span>Role Governance</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Assigned Role</span>
              <span className="font-semibold text-foreground">{user.role.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Role Type</span>
              <span className="font-mono text-foreground">{user.role.type}</span>
            </div>
            <div className="flex justify-between py-1 items-center">
              <span className="text-muted-foreground">Role Matrix</span>
              <Link
                href={`/dashboard/roles/${user.role.id}`}
                className="text-primary hover:text-primary-hover font-medium text-[11px]"
              >
                Configure Privileges →
              </Link>
            </div>
          </div>
        </Card>

        {/* Timestamps & Identifiers Card */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Metadata & Timestamps</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Created At</span>
              <span className="font-mono text-foreground">
                {new Date(user.createdAt).toLocaleDateString('en-US')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-mono text-foreground">
                {new Date(user.updatedAt).toLocaleDateString('en-US')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
                {user.id}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Active User Sessions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle>Connected Device Sessions</CardTitle>
            <CardDescription>Live authenticated sessions across browser clients</CardDescription>
          </div>
          {sessions && sessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsRevokeModalOpen(true)}
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
            >
              Revoke All Devices
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Client / Browser</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSessionsLoading ? (
                <TableSkeleton rows={3} cols={5} />
              ) : sessions && sessions.length > 0 ? (
                sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Badge variant={s.status === 'ACTIVE' ? 'active' : 'inactive'} size="sm">
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <Laptop className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-xs">{s.userAgent || 'Unknown Device'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {s.ipAddress || '127.0.0.1'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(s.lastActiveAt).toLocaleString('en-US')}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(s.expiresAt).toLocaleDateString('en-US')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No active sessions found for this user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirm Revoke Modal */}
      <ConfirmModal
        isOpen={isRevokeModalOpen}
        onClose={() => setIsRevokeModalOpen(false)}
        onConfirm={handleRevokeSessions}
        title="Revoke All User Sessions"
        message={`This will invalidate all current session cookies and refresh tokens for ${user.email}.`}
        confirmText="Revoke Sessions"
        isLoading={revokeMutation.isPending}
        isDestructive={true}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Deactivate User Account"
        message={`Are you sure you want to deactivate ${user.email}? This action is irreversible without direct database intervention.`}
        confirmText="Deactivate Account"
        isLoading={deleteMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
