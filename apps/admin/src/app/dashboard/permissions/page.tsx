'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { KeyRound, Search, Shield, Layers, Lock, Sparkles, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  TableSkeleton,
} from '@/components/ui/data-table';
import { permissionsQueryOptions, rolesQueryOptions } from '@/lib/admin/roles.queries';
import type { Permission } from '@/lib/admin/roles.types';

export default function PermissionsDirectoryPage() {
  const { data: permissions, isLoading: isPermsLoading } = useQuery(permissionsQueryOptions);
  const { data: roles, isLoading: isRolesLoading } = useQuery(rolesQueryOptions);

  const [search, setSearch] = React.useState('');

  // Map permissions to which roles have them
  const rolesByPermission = React.useMemo(() => {
    const map = new Map<string, Array<{ id: string; name: string; type: 'SYSTEM' | 'CUSTOM' }>>();

    if (!roles) return map;

    for (const r of roles) {
      if (r.name === 'ADMIN') {
        // ADMIN has all permissions
        for (const p of permissions || []) {
          const list = map.get(p.name) || [];
          list.push({ id: r.id, name: r.name, type: r.type });
          map.set(p.name, list);
        }
      } else if (r.rolePermissions) {
        for (const rp of r.rolePermissions) {
          const permName = rp.permission?.name;
          if (permName) {
            const list = map.get(permName) || [];
            if (!list.some((existing) => existing.id === r.id)) {
              list.push({ id: r.id, name: r.name, type: r.type });
              map.set(permName, list);
            }
          }
        }
      }
    }

    return map;
  }, [roles, permissions]);

  const filtered = React.useMemo(() => {
    if (!permissions) return [];
    if (!search.trim()) return permissions;
    const q = search.toLowerCase();
    return permissions.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
    );
  }, [permissions, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Permissions Directory
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Master registry of platform authorization capabilities and privileges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-mono text-muted-foreground border border-border">
            <span>Total Capabilities:</span>
            <span className="font-semibold text-foreground">{permissions?.length ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="w-full max-w-sm">
        <Input
          placeholder="Search by capability or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Permissions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Capability Key</TableHead>
                <TableHead className="w-[40%]">Scope & Description</TableHead>
                <TableHead className="w-[30%]">Authorized Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPermsLoading || isRolesLoading ? (
                <TableSkeleton rows={10} cols={3} />
              ) : filtered.length > 0 ? (
                filtered.map((p) => {
                  const assignedRoles = rolesByPermission.get(p.name) || [];

                  return (
                    <TableRow key={p.id}>
                      {/* Permission Name */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                            <KeyRound className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {p.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="text-xs text-muted-foreground">
                        {p.description || 'System operation privilege'}
                      </TableCell>

                      {/* Assigned Roles */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {assignedRoles.length > 0 ? (
                            assignedRoles.map((r) => (
                              <Link key={r.id} href={`/dashboard/roles/${r.id}`}>
                                <Badge
                                  variant={r.type === 'SYSTEM' ? 'system' : 'custom'}
                                  size="sm"
                                  className="hover:scale-105 transition-transform cursor-pointer"
                                >
                                  {r.name}
                                </Badge>
                              </Link>
                            ))
                          ) : (
                            <span className="text-[11px] font-mono text-muted-foreground/60">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableEmpty
                  title="No privileges found"
                  description="No capabilities matched your filter query."
                  colSpan={3}
                />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
