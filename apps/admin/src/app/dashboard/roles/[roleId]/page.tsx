'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Shield,
  KeyRound,
  Check,
  RotateCcw,
  Lock,
  Save,
  CheckCheck,
  X,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  roleDetailQueryOptions,
  rolePermissionsQueryOptions,
  permissionsQueryOptions,
  useReplacePermissionsMutation,
} from '@/lib/admin/roles.queries';
import type { Permission } from '@/lib/admin/roles.types';

// Helper to categorize permissions by prefix/domain
function categorizePermissions(permissions: readonly Permission[]) {
  const categories: Record<string, Permission[]> = {
    'User Management': [],
    'Course Management': [],
    'Lessons & Curriculum': [],
    'Enrollment & Learning Progress': [],
    'Reviews & Feedback': [],
    'Orders & Payments': [],
    'Platform Security & Audit': [],
    'Other Privileges': [],
  };

  for (const p of permissions) {
    if (p.name.startsWith('user:')) {
      categories['User Management'].push(p);
    } else if (p.name.startsWith('course:')) {
      categories['Course Management'].push(p);
    } else if (p.name.startsWith('lesson:')) {
      categories['Lessons & Curriculum'].push(p);
    } else if (p.name.startsWith('enrollment:') || p.name.startsWith('progress:')) {
      categories['Enrollment & Learning Progress'].push(p);
    } else if (p.name.startsWith('review:')) {
      categories['Reviews & Feedback'].push(p);
    } else if (p.name.startsWith('order:') || p.name.startsWith('payment:')) {
      categories['Orders & Payments'].push(p);
    } else if (p.name.startsWith('audit-log:') || p.name === 'ROLE_PERMISSION_MANAGE') {
      categories['Platform Security & Audit'].push(p);
    } else {
      categories['Other Privileges'].push(p);
    }
  }

  // Filter out empty categories
  return Object.entries(categories).filter(([_, items]) => items.length > 0);
}

export default function RolePermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.roleId as string;

  const { data: role, isLoading: isRoleLoading } = useQuery(roleDetailQueryOptions(roleId));
  const { data: assignedPermissionsData, isLoading: isAssignedLoading } = useQuery(
    rolePermissionsQueryOptions(roleId),
  );
  const { data: allPermissions, isLoading: isAllPermsLoading } = useQuery(permissionsQueryOptions);

  const [search, setSearch] = React.useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = React.useState<string[]>([]);
  const [initialPermissionIds, setInitialPermissionIds] = React.useState<string[]>([]);
  const [isDirty, setIsDirty] = React.useState(false);

  // Sync initial permissions once loaded
  React.useEffect(() => {
    if (allPermissions && assignedPermissionsData) {
      // assignedPermissionsData.permissions is string[] of permission names or records
      const assignedNames = new Set(
        Array.isArray(assignedPermissionsData.permissions)
          ? assignedPermissionsData.permissions
          : [],
      );

      const assignedIds = allPermissions.filter((p) => assignedNames.has(p.name)).map((p) => p.id);

      setSelectedPermissionIds(assignedIds);
      setInitialPermissionIds(assignedIds);
      setIsDirty(false);
    }
  }, [allPermissions, assignedPermissionsData]);

  // Track dirty state
  const handleToggle = (permId: string) => {
    if (role?.type === 'SYSTEM') return;

    setSelectedPermissionIds((prev) => {
      const next = prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId];
      const dirty =
        next.length !== initialPermissionIds.length ||
        next.some((id) => !initialPermissionIds.includes(id));
      setIsDirty(dirty);
      return next;
    });
  };

  const handleSelectCategory = (categoryPerms: Permission[], selectAll: boolean) => {
    if (role?.type === 'SYSTEM') return;

    const catIds = categoryPerms.map((p) => p.id);
    setSelectedPermissionIds((prev) => {
      let next: string[];
      if (selectAll) {
        next = Array.from(new Set([...prev, ...catIds]));
      } else {
        next = prev.filter((id) => !catIds.includes(id));
      }
      const dirty =
        next.length !== initialPermissionIds.length ||
        next.some((id) => !initialPermissionIds.includes(id));
      setIsDirty(dirty);
      return next;
    });
  };

  const handleReset = () => {
    setSelectedPermissionIds(initialPermissionIds);
    setIsDirty(false);
  };

  const replaceMutation = useReplacePermissionsMutation(roleId);

  const handleSave = async () => {
    if (!role || role.type === 'SYSTEM') return;

    try {
      await replaceMutation.mutateAsync({
        permissionIds: selectedPermissionIds,
      });
      setInitialPermissionIds(selectedPermissionIds);
      setIsDirty(false);
      toast.success(`Permissions matrix updated for ${role.name}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save permissions.';
      toast.error(msg);
    }
  };

  const isSystem = role?.type === 'SYSTEM';

  // Filter permissions by search
  const filteredPermissions = React.useMemo(() => {
    if (!allPermissions) return [];
    if (!search.trim()) return allPermissions;
    const q = search.toLowerCase();
    return allPermissions.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
    );
  }, [allPermissions, search]);

  const categories = React.useMemo(() => {
    return categorizePermissions(filteredPermissions);
  }, [filteredPermissions]);

  if (isRoleLoading || isAssignedLoading || isAllPermsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-muted/60 animate-pulse" />
        <div className="h-28 rounded-xl bg-muted/40 animate-pulse" />
        <div className="h-96 rounded-xl bg-muted/30 animate-pulse" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Role not found</h2>
        <Link href="/dashboard/roles">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Roles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/roles">
          <Button variant="outline" size="iconSm" aria-label="Back to Roles">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground">
          Roles / {role.name} / Permissions Matrix
        </span>
      </div>

      {/* Role Hero Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{role.name}</h1>
              <Badge variant={isSystem ? 'system' : 'custom'}>{role.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {role.description || 'System access role definition'}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-muted-foreground">
              Granted Privileges:{' '}
              <span className="font-semibold text-foreground">{selectedPermissionIds.length}</span>{' '}
              of {allPermissions?.length ?? 0}
            </span>
          </div>
        </div>

        {/* System Role Lock Warning */}
        {isSystem && (
          <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-indigo-500/10 p-3 text-xs text-indigo-300 border border-indigo-500/20">
            <Lock className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              System roles are platform presets. Permissions cannot be modified directly to
              guarantee operational security and core RBAC stability.
            </span>
          </div>
        )}
      </Card>

      {/* Search & Filter Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Filter privileges by name or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Categorized Permissions Grid */}
      <div className="space-y-6">
        {categories.map(([categoryName, perms]) => {
          const allInCatSelected = perms.every((p) => selectedPermissionIds.includes(p.id));
          const someInCatSelected = perms.some((p) => selectedPermissionIds.includes(p.id));

          return (
            <Card key={categoryName} className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-secondary/20">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                    {categoryName}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ({perms.filter((p) => selectedPermissionIds.includes(p.id)).length}/
                    {perms.length})
                  </span>
                </div>

                {!isSystem && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectCategory(perms, !allInCatSelected)}
                      className="text-[11px] h-7 px-2"
                    >
                      {allInCatSelected ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {perms.map((perm) => {
                  const isChecked = selectedPermissionIds.includes(perm.id);

                  return (
                    <div
                      key={perm.id}
                      onClick={() => handleToggle(perm.id)}
                      className={`flex items-start justify-between p-3 rounded-xl border transition-all select-none ${
                        isSystem
                          ? 'cursor-default opacity-85'
                          : 'cursor-pointer hover:border-border-hover'
                      } ${
                        isChecked
                          ? 'bg-primary/10 border-primary/30 shadow-xs'
                          : 'bg-secondary/20 border-border/60 hover:bg-secondary/40'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs font-semibold ${
                              isChecked ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            {perm.name}
                          </span>
                        </div>
                        {perm.description && (
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            {perm.description}
                          </p>
                        )}
                      </div>

                      {/* Custom Switch / Checkbox */}
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                          isChecked
                            ? 'bg-primary border-primary text-white shadow-xs shadow-primary/40'
                            : 'border-border bg-secondary/50'
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Floating Sticky Save Bar (if dirty and not system) */}
      {isDirty && !isSystem && (
        <div className="fixed bottom-6 inset-x-0 mx-auto max-w-2xl px-4 z-40 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <p className="text-xs font-medium text-foreground">
                You have unsaved changes to this role&apos;s permissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={replaceMutation.isPending}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={replaceMutation.isPending}
                leftIcon={<Save className="h-3.5 w-3.5" />}
              >
                Save Matrix
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
