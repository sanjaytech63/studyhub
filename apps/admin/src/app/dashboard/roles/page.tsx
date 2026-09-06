'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Shield,
  ShieldPlus,
  Users,
  KeyRound,
  Trash2,
  Edit2,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  rolesQueryOptions,
  permissionsQueryOptions,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '@/lib/admin/roles.queries';
import type { Role, Permission } from '@/lib/admin/roles.types';
import {
  createRoleFormSchema,
  type CreateRoleFormValues,
  updateRoleFormSchema,
  type UpdateRoleFormValues,
} from '@/lib/admin/roles.schema';

export default function RolesManagementPage() {
  const queryClient = useQueryClient();

  const { data: roles, isLoading: isRolesLoading } = useQuery(rolesQueryOptions);
  const { data: permissions } = useQuery(permissionsQueryOptions);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = React.useState<Role | null>(null);

  // Forms
  const createForm = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionIds: [],
    },
  });

  const editForm = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createRoleMutation = useCreateRoleMutation();
  const updateRoleMutation = useUpdateRoleMutation(editingRole?.id ?? '');
  const deleteRoleMutation = useDeleteRoleMutation();

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    editForm.reset({
      name: role.name,
      description: role.description || '',
    });
  };

  const selectedPermissionIds = createForm.watch('permissionIds') || [];

  const handleTogglePermission = (permId: string) => {
    const current = createForm.getValues('permissionIds') || [];
    if (current.includes(permId)) {
      createForm.setValue(
        'permissionIds',
        current.filter((id) => id !== permId),
        { shouldValidate: true },
      );
    } else {
      createForm.setValue('permissionIds', [...current, permId], { shouldValidate: true });
    }
  };

  const handleCreateSubmit = async (values: CreateRoleFormValues) => {
    try {
      await createRoleMutation.mutateAsync({
        name: values.name.toUpperCase().trim(),
        description: values.description?.trim() || '',
        permissionIds: values.permissionIds,
      });
      toast.success(`Role ${values.name} created successfully.`);
      setIsCreateModalOpen(false);
      createForm.reset({
        name: '',
        description: '',
        permissionIds: [],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create role.';
      toast.error(msg);
    }
  };

  const handleEditSubmit = async (values: UpdateRoleFormValues) => {
    if (!editingRole) return;

    try {
      await updateRoleMutation.mutateAsync({
        name: values.name.toUpperCase().trim(),
        description: values.description?.trim() || '',
      });
      toast.success('Role updated successfully.');
      setEditingRole(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update role.';
      toast.error(msg);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deletingRole) return;
    try {
      await deleteRoleMutation.mutateAsync(deletingRole.id);
      toast.success(`Role ${deletingRole.name} deleted.`);
      setDeletingRole(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete role.';
      toast.error(msg);
    }
  };

  const systemRolesCount = roles?.filter((r) => r.type === 'SYSTEM').length ?? 0;
  const customRolesCount = roles?.filter((r) => r.type === 'CUSTOM').length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Roles & RBAC</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Role definitions, privilege assignments, and fine-grained authorization policies.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            createForm.reset({
              name: '',
              description: '',
              permissionIds: [],
            });
            setIsCreateModalOpen(true);
          }}
          leftIcon={<ShieldPlus className="h-4 w-4" />}
        >
          Create Custom Role
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{roles?.length ?? 0}</div>
            <div className="text-xs text-muted-foreground">Total Active Roles</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{systemRolesCount}</div>
            <div className="text-xs text-muted-foreground">System Protected Roles</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{permissions?.length ?? 0}</div>
            <div className="text-xs text-muted-foreground">Total System Permissions</div>
          </div>
        </Card>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isRolesLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-card/40 animate-pulse" />
          ))
        ) : roles && roles.length > 0 ? (
          roles.map((role) => {
            const isSystem = role.type === 'SYSTEM';
            const permsCount = role.rolePermissions?.length ?? 0;
            const usersCount = role._count?.users ?? 0;

            return (
              <Card
                key={role.id}
                className="flex flex-col justify-between hover:border-border transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-mono font-bold tracking-tight">
                          {role.name}
                        </CardTitle>
                        <Badge variant={isSystem ? 'system' : 'custom'}>{role.type}</Badge>
                      </div>
                      <CardDescription className="mt-1.5 text-xs line-clamp-2">
                        {role.description || 'No description specified for this role.'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Counts */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{usersCount} users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{permsCount} permissions</span>
                    </div>
                  </div>

                  {/* Sample Permissions Badges */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Assigned Privileges
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-hidden">
                      {role.rolePermissions && role.rolePermissions.length > 0 ? (
                        <>
                          {role.rolePermissions.slice(0, 4).map((p) => (
                            <span
                              key={p.permission.id}
                              className="px-1.5 py-0.5 text-[10px] font-mono bg-secondary text-secondary-foreground rounded border border-border/40"
                              title={p.permission.description || p.permission.name}
                            >
                              {p.permission.name}
                            </span>
                          ))}
                          {role.rolePermissions.length > 4 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                              +{role.rolePermissions.length - 4} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No direct permissions assigned
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Footer Controls */}
                <div className="p-4 border-t border-border/50 bg-secondary/10 flex items-center justify-between rounded-b-xl">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    ID: {role.id.slice(0, 8)}...
                  </span>

                  {!isSystem && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => handleOpenEdit(role)}
                        title="Edit Role Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => setDeletingRole(role)}
                        title="Delete Role"
                        className="text-destructive hover:bg-destructive/10"
                        disabled={usersCount > 0}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  {isSystem && (
                    <span
                      className="p-1 text-muted-foreground"
                      title="System roles cannot be deleted"
                    >
                      <Lock className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-xs text-muted-foreground">
            No roles configured.
          </div>
        )}
      </div>

      {/* Create Custom Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Custom Role"
        description="Define a new role and optionally grant initial permissions."
        maxWidth="lg"
      >
        <form
          onSubmit={createForm.handleSubmit(handleCreateSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <Label htmlFor="roleName" required>
              Role Identifier (Unique uppercase name)
            </Label>
            <Input
              id="roleName"
              placeholder="e.g. MODERATOR, CONTENT_EDITOR"
              {...createForm.register('name')}
              onChange={(e) => createForm.setValue('name', e.target.value.toUpperCase())}
              error={createForm.formState.errors.name?.message}
            />
          </div>

          <div>
            <Label htmlFor="roleDesc">Role Description</Label>
            <Textarea
              id="roleDesc"
              placeholder="Describe the responsibility and scope of this role..."
              {...createForm.register('description')}
              error={createForm.formState.errors.description?.message}
            />
          </div>

          <div>
            <Label>Initial Assigned Privileges ({selectedPermissionIds.length} selected)</Label>
            <div className="max-h-52 overflow-y-auto rounded-lg border border-border/70 bg-secondary/30 p-3 space-y-2">
              {permissions?.map((perm) => {
                const isChecked = selectedPermissionIds.includes(perm.id);
                return (
                  <label
                    key={perm.id}
                    className="flex items-start gap-2.5 p-1.5 rounded hover:bg-secondary/60 cursor-pointer text-xs select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="mt-0.5 rounded border-border text-primary focus:ring-primary/25 cursor-pointer"
                    />
                    <div>
                      <span className="font-mono font-medium text-foreground">{perm.name}</span>
                      {perm.description && (
                        <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createRoleMutation.isPending}
            >
              Create Role
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={Boolean(editingRole)}
        onClose={() => setEditingRole(null)}
        title="Edit Role Details"
        description={`Modify name or description for role ${editingRole?.name}`}
        maxWidth="md"
      >
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="editName" required>
              Role Identifier
            </Label>
            <Input
              id="editName"
              {...editForm.register('name')}
              onChange={(e) => editForm.setValue('name', e.target.value.toUpperCase())}
              error={editForm.formState.errors.name?.message}
            />
          </div>

          <div>
            <Label htmlFor="editDesc">Description</Label>
            <Textarea
              id="editDesc"
              {...editForm.register('description')}
              error={editForm.formState.errors.description?.message}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={updateRoleMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Role Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingRole)}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDeleteSubmit}
        title="Delete Custom Role"
        message={`Are you sure you want to delete role ${deletingRole?.name}? All associated role-permission relationships will be purged.`}
        confirmText="Delete Role"
        isLoading={deleteRoleMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
