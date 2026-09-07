'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Search,
  UserPlus,
  CheckCircle2,
  XCircle,
  Trash2,
  LogOut,
  Edit2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  TableSkeleton,
  TablePagination,
} from '@/components/ui/data-table';
import {
  adminUsersQueryOptions,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRevokeUserSessionsMutation,
} from '@/lib/admin/users.queries';
import { rolesQueryOptions } from '@/lib/admin/roles.queries';
import type { AdminUserSummary, UserStatus } from '@/lib/admin/users.types';
import {
  createUserFormSchema,
  type CreateUserFormValues,
  updateUserFormSchema,
  type UpdateUserFormValues,
} from '@/lib/admin/users.schema';
import { getApiErrorMessage } from '@/lib/api/api-client';

export default function UsersDirectoryPage() {
  // Search & Filter State
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<UserStatus | 'ALL'>('ALL');
  const [roleFilter, setRoleFilter] = React.useState<string>('ALL');
  const [sortBy, setSortBy] = React.useState<'createdAt' | 'email' | 'firstName' | 'status'>(
    'createdAt',
  );
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Query Users
  const { data, isLoading, isFetching, refetch } = useQuery(
    adminUsersQueryOptions({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      roleId: roleFilter === 'ALL' ? undefined : roleFilter,
      sortBy,
      sortOrder,
    }),
  );

  // Query Roles for filter dropdown and create/edit user
  const { data: roles } = useQuery(rolesQueryOptions);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<AdminUserSummary | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<AdminUserSummary | null>(null);
  const [revokingUser, setRevokingUser] = React.useState<AdminUserSummary | null>(null);

  // Create User Form
  const createForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleId: '',
      status: 'ACTIVE',
    },
  });

  // Edit User Form
  const editForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleId: '',
      status: 'ACTIVE',
    },
  });

  // Set default role for new user once roles load
  React.useEffect(() => {
    if (roles && roles.length > 0 && !createForm.getValues('roleId')) {
      const studentRole = roles.find((r) => r.name === 'STUDENT') || roles[0];
      createForm.setValue('roleId', studentRole.id);
    }
  }, [roles, createForm]);

  // Open Edit User modal helper
  const handleOpenEdit = (user: AdminUserSummary) => {
    setEditingUser(user);
    editForm.reset({
      firstName: user.firstName,
      lastName: user.lastName || '',
      email: user.email,
      password: '',
      roleId: user.role.id,
      status: user.status === 'DELETED' ? 'INACTIVE' : user.status,
    });
  };

  // Mutations
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const revokeSessionsMutation = useRevokeUserSessionsMutation(revokingUser?.id ?? '');

  // Handle Create User Submit
  const handleCreateSubmit = async (values: CreateUserFormValues) => {
    try {
      const res = await createUserMutation.mutateAsync({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName || null,
        roleId: values.roleId,
        status: values.status,
      });
      toast.success(res?.message || `User ${values.email} created successfully.`);
      setIsCreateModalOpen(false);
      createForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleId: roles?.find((r) => r.name === 'STUDENT')?.id || roles?.[0]?.id || '',
        status: 'ACTIVE',
      });
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to create user.'));
    }
  };

  // Handle Edit User Submit
  const handleEditSubmit = async (values: UpdateUserFormValues) => {
    if (!editingUser) return;

    try {
      const res = await updateUserMutation.mutateAsync({
        userId: editingUser.id,
        payload: {
          firstName: values.firstName.trim(),
          lastName: values.lastName?.trim() || null,
          email: values.email.trim() !== editingUser.email ? values.email.trim() : undefined,
          password: values.password?.trim() ? values.password.trim() : undefined,
          roleId: values.roleId,
          status: values.status,
        },
      });
      toast.success(res?.message || 'User updated successfully.');
      setEditingUser(null);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to update user.'));
    }
  };

  // Handle Soft Delete
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await deleteUserMutation.mutateAsync(deletingUser.id);
      toast.success(res?.message || `User ${deletingUser.email} has been deactivated.`);
      setDeletingUser(null);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to delete user.'));
    }
  };

  // Handle Revoke Sessions
  const handleConfirmRevoke = async () => {
    if (!revokingUser) return;
    try {
      const res = await revokeSessionsMutation.mutateAsync();
      toast.success(res?.message || `All sessions for ${revokingUser.email} revoked.`);
      setRevokingUser(null);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to revoke sessions.'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users Directory</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage user accounts, assign roles, enforce security policies, and manage active
            sessions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => refetch()}
            isLoading={isFetching}
            className="w-full sm:w-auto"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto"
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Create New User
          </Button>
        </div>
      </div>

      {/* Toolbar / Filters Card */}
      <Card className="p-4 space-y-4">
        {/* Search Bar + Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:col-span-2">
            <Input
              placeholder="Search by name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Role Filter */}
          <div>
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                if (val) {
                  setRoleFilter(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {roles?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(val) => {
                if (val) {
                  const [sb, so] = val.split('-') as [
                    'createdAt' | 'email' | 'firstName' | 'status',
                    'asc' | 'desc',
                  ];
                  setSortBy(sb);
                  setSortOrder(so);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="firstName-asc">Name (A-Z)</SelectItem>
                <SelectItem value="firstName-desc">Name (Z-A)</SelectItem>
                <SelectItem value="status-asc">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-border/40 text-xs">
          <span className="text-muted-foreground mr-2 font-mono text-[11px]">STATUS:</span>
          {(['ALL', 'ACTIVE', 'SUSPENDED', 'INACTIVE', 'DELETED'] as const).map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium font-mono transition-all select-none cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs shadow-primary/30 border border-primary'
                    : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Active Sessions</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={10} cols={7} />
          ) : data?.users && data.users.length > 0 ? (
            data.users.map((u) => (
              <TableRow key={u.id}>
                {/* User Info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      firstName={u.firstName}
                      lastName={u.lastName}
                      email={u.email}
                      avatarUrl={u.avatarUrl}
                      size="sm"
                      isOnline={u._count.sessions > 0}
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/users/${u.id}`}
                        className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {u.firstName} {u.lastName || ''}
                      </Link>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <Badge variant={u.role.type === 'SYSTEM' ? 'system' : 'custom'} size="sm">
                    {u.role.name}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={
                      u.status === 'ACTIVE'
                        ? 'active'
                        : u.status === 'SUSPENDED'
                          ? 'suspended'
                          : u.status === 'DELETED'
                            ? 'deleted'
                            : 'inactive'
                    }
                    size="sm"
                  >
                    {u.status}
                  </Badge>
                </TableCell>

                {/* Verified */}
                <TableCell>
                  {u.emailVerifiedAt ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-mono">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground/70 text-xs font-mono">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Pending</span>
                    </span>
                  )}
                </TableCell>

                {/* Active Sessions */}
                <TableCell>
                  <Link
                    href={`/dashboard/users/${u.id}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs hover:text-primary transition-colors"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        u._count.sessions > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                      }`}
                    />
                    <span>{u._count.sessions} active</span>
                  </Link>
                </TableCell>

                {/* Joined */}
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/dashboard/users/${u.id}`}>
                      <Button variant="ghost" size="iconSm" title="Inspect User Details">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => handleOpenEdit(u)}
                      title="Edit User"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    {u._count.sessions > 0 && (
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => setRevokingUser(u)}
                        title="Revoke All Sessions"
                        className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    {u.status !== 'DELETED' && (
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => setDeletingUser(u)}
                        title="Deactivate / Delete User"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmpty
              title="No users match your criteria"
              description="Try adjusting your search query, status filters, or role selection."
              colSpan={7}
            />
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          limit={data.pagination.limit}
          onPageChange={setPage}
          hasNext={data.pagination.hasNext}
          hasPrev={data.pagination.hasPrev}
        />
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        description="Provision a new account with specified credentials and RBAC role."
        maxWidth="md"
      >
        <form
          onSubmit={createForm.handleSubmit(handleCreateSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" required>
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                {...createForm.register('firstName')}
                error={createForm.formState.errors.firstName?.message}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...createForm.register('lastName')}
                error={createForm.formState.errors.lastName?.message}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" required>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...createForm.register('email')}
              error={createForm.formState.errors.email?.message}
            />
          </div>

          <div>
            <Label htmlFor="password" required>
              Initial Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              {...createForm.register('password')}
              error={createForm.formState.errors.password?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Controller
              control={createForm.control}
              name="roleId"
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="create-role" required>
                    Assigned Role
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="create-role" error={fieldState.error?.message}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name} ({r.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              control={createForm.control}
              name="status"
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="create-status" required>
                    Initial Status
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="create-status" error={fieldState.error?.message}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              isLoading={createUserMutation.isPending}
            >
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="Edit User Details"
        description={`Update account properties and access level for ${editingUser?.email}`}
        maxWidth="md"
      >
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="editFirstName" required>
                First Name
              </Label>
              <Input
                id="editFirstName"
                {...editForm.register('firstName')}
                error={editForm.formState.errors.firstName?.message}
              />
            </div>
            <div>
              <Label htmlFor="editLastName">Last Name</Label>
              <Input
                id="editLastName"
                {...editForm.register('lastName')}
                error={editForm.formState.errors.lastName?.message}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="editEmail" required>
              Email Address
            </Label>
            <Input
              id="editEmail"
              type="email"
              {...editForm.register('email')}
              error={editForm.formState.errors.email?.message}
            />
          </div>

          <div>
            <Label htmlFor="editPassword">
              Reset Password{' '}
              <span className="text-[11px] font-normal text-muted-foreground">
                (leave blank to keep current)
              </span>
            </Label>
            <Input
              id="editPassword"
              type="password"
              placeholder="Enter new password (at least 8 chars)"
              {...editForm.register('password')}
              error={editForm.formState.errors.password?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Controller
              control={editForm.control}
              name="roleId"
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="edit-role" required>
                    Assigned Role
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="edit-role" error={fieldState.error?.message}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name} ({r.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              control={editForm.control}
              name="status"
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="edit-status" required>
                    Account Status
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="edit-status" error={fieldState.error?.message}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              isLoading={updateUserMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Soft Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
        title="Deactivate User Account"
        message={`Are you sure you want to delete ${deletingUser?.email}? The user will be marked as DELETED and all active sessions & refresh tokens will be immediately revoked.`}
        confirmText="Deactivate Account"
        isLoading={deleteUserMutation.isPending}
        isDestructive={true}
      />

      {/* Confirm Revoke Sessions Modal */}
      <ConfirmModal
        isOpen={Boolean(revokingUser)}
        onClose={() => setRevokingUser(null)}
        onConfirm={handleConfirmRevoke}
        title="Revoke Active Sessions"
        message={`Are you sure you want to terminate all active login sessions for ${revokingUser?.email}? The user will be immediately signed out from all connected devices.`}
        confirmText="Revoke All Sessions"
        isLoading={revokeSessionsMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
