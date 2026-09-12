'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Percent,
  Check,
  Copy,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAdminCoupons, useCreateAdminCouponMutation } from '@/lib/admin/lms.queries';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  TableEmpty,
} from '@/components/ui/data-table';
import { getApiErrorMessage } from '@/lib/api/api-client';

export default function AdminCouponsPage() {
  const { filters, updateFilters } = useUrlFilters<{ search?: string }>();
  const search = filters.search || '';

  const { data: coupons = [], isLoading, isError, refetch, isRefetching } = useAdminCoupons();

  const createMutation = useCreateAdminCouponMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    toast.success(`Copied coupon code ${couponCode}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please specify a valid coupon code');
      return;
    }

    try {
      await createMutation.mutateAsync({
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: Number(discountValue) || 10,
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
      });

      toast.success(`Coupon ${code.toUpperCase().trim()} created successfully.`);
      setShowCreateModal(false);
      setCode('');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const filtered = coupons.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            Coupon &amp; Discount Management
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Create conversion promo codes, flash sales, and cart incentives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Promo Coupon
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search by promo code (e.g. WELCOME50)..."
            value={search}
            onChange={(e) => updateFilters({ search: e.target.value || undefined })}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      {isError ? (
        <Card className="p-10 text-center space-y-3">
          <AlertCircle className="size-8 text-destructive mx-auto" />
          <h3 className="text-sm font-bold text-foreground">Failed to load coupons</h3>
          <p className="text-xs text-muted-foreground">
            Unable to retrieve promotions from the coupon engine.
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promo Code</TableHead>
              <TableHead>Discount Rate</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : filtered.length === 0 ? (
              <TableEmpty
                colSpan={6}
                title="No promo coupons"
                description={
                  search
                    ? `No coupons match query "${search}".`
                    : 'Create your first promotional discount coupon to boost student enrollment.'
                }
              />
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-primary tracking-wider bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(c.code)}
                        className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Copy promo code"
                      >
                        {copiedCode === c.code ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground font-mono">
                    {c.discountType === 'PERCENTAGE' ? (
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3 text-primary" />
                        {c.discountValue}% OFF
                      </span>
                    ) : (
                      `₹${c.discountValue} FLAT OFF`
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {c.minOrderAmount > 0 ? `₹${c.minOrderAmount.toLocaleString()}` : 'No minimum'}
                  </TableCell>
                  <TableCell className="font-mono text-foreground">
                    <span className="font-bold">{c.timesUsed}</span>
                    <span className="text-muted-foreground">
                      {' '}
                      / {c.usageLimit ? c.usageLimit : '∞'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {c.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
                        INACTIVE
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(c.code)}>
                      Copy Code
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Promotional Coupon"
        description="Define a promotional discount code with custom limits and requirements."
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Coupon Code *</label>
            <Input
              type="text"
              required
              placeholder="e.g. WELCOME50, SUPERPROMO"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono font-bold tracking-wider"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Type</label>
              <NativeSelect
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'PERCENTAGE' | 'FIXED')}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat (₹)</option>
              </NativeSelect>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Discount Value *</label>
              <Input
                type="number"
                required
                placeholder="e.g. 20"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Min Order Amount (₹)</label>
              <Input
                type="number"
                placeholder="e.g. 499"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Max Discount (₹)</label>
              <Input
                type="number"
                placeholder="Optional cap"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Usage Limit</label>
            <Input
              type="number"
              placeholder="Optional limit (e.g. 100)"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={createMutation.isPending}>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
