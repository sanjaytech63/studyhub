'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  RefreshCw,
  TrendingUp,
  Clock,
  Download,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  Zap,
  AlertCircle,
  X,
  GraduationCap,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAdminPayments } from '@/lib/admin/lms.queries';
import type { AdminPayment } from '@/services/admin-lms.service';
import { useUrlFilters } from '@/hooks/use-url-filters';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { StatCard } from '@/components/ui/stat-card';
import { Modal } from '@/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  TableEmpty,
  TablePagination,
} from '@/components/ui/data-table';

export default function AdminPaymentsPage() {
  const { filters, updateFilters } = useUrlFilters<{
    page?: number;
    limit?: number;
    provider?: string;
    status?: string;
    search?: string;
  }>({
    page: 1,
    limit: 15,
  });

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 15;
  const provider = filters.provider;
  const status = filters.status;
  const search = filters.search || '';

  const { data, isLoading, isError, isRefetching, refetch } = useAdminPayments({
    page,
    limit,
    provider: provider === 'ALL' ? undefined : provider,
    status: status === 'ALL' ? undefined : status,
  });

  const rawPayments = useMemo(() => data?.payments ?? [], [data?.payments]);
  const pagination = data?.pagination ?? { page: 1, limit: 15, totalCount: 0, totalPages: 1 };

  // Local search filter across gateway ID, order number, student name/email, and course
  const payments = useMemo(() => {
    if (!search.trim()) return rawPayments;
    const q = search.trim().toLowerCase();
    return rawPayments.filter((p) => {
      const pId = p.providerPaymentId?.toLowerCase() || '';
      const oId = p.order?.orderNumber?.toLowerCase() || p.orderId.toLowerCase();
      const cTitle = p.order?.course?.title?.toLowerCase() || '';
      const email = p.order?.user?.email?.toLowerCase() || '';
      const name =
        `${p.order?.user?.firstName || ''} ${p.order?.user?.lastName || ''}`.toLowerCase();
      return (
        pId.includes(q) ||
        oId.includes(q) ||
        cTitle.includes(q) ||
        email.includes(q) ||
        name.includes(q)
      );
    });
  }, [rawPayments, search]);

  // Inspection modal & copy state
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Financial KPI computations
  const totalSettled = useMemo(() => {
    return rawPayments.filter((p) => p.status === 'SUCCESS').reduce((acc, p) => acc + p.amount, 0);
  }, [rawPayments]);

  const successfulCount = useMemo(() => {
    return rawPayments.filter((p) => p.status === 'SUCCESS').length;
  }, [rawPayments]);

  const pendingCount = useMemo(() => {
    return rawPayments.filter((p) => p.status === 'PENDING').length;
  }, [rawPayments]);

  const failedCount = useMemo(() => {
    return rawPayments.filter((p) => p.status === 'FAILED').length;
  }, [rawPayments]);

  const successRate = useMemo(() => {
    if (rawPayments.length === 0) return '100.0';
    return ((successfulCount / rawPayments.length) * 100).toFixed(1);
  }, [rawPayments.length, successfulCount]);

  // Copy token helper
  const handleCopy = (e: React.MouseEvent, text: string, label = 'Copied') => {
    e.stopPropagation();
    void navigator.clipboard.writeText(text);
    setCopiedToken(text);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (payments.length === 0) {
      toast.error('No payments available to export');
      return;
    }

    const headers = [
      'Gateway Payment ID',
      'Provider',
      'Order ID',
      'Course',
      'Customer Name',
      'Customer Email',
      'Amount',
      'Currency',
      'Status',
      'Settled At',
    ];

    const rows = payments.map((p) => [
      p.providerPaymentId,
      p.provider,
      p.order?.orderNumber || p.orderId,
      `"${p.order?.course?.title?.replace(/"/g, '""') || 'Course'}"`,
      `"${p.order?.user?.firstName || 'Student'} ${p.order?.user?.lastName || ''}".trim()`,
      p.order?.user?.email || 'N/A',
      p.amount,
      p.currency || 'INR',
      p.status,
      `"${new Date(p.createdAt).toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `studyhub-payments-ledger-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${payments.length} payment records to CSV`);
  };

  // Status badge renderer
  const renderStatusBadge = (status: AdminPayment['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant="active" size="sm" className="font-mono">
            SUCCESS
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="suspended" size="sm" className="font-mono">
            PENDING
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="deleted" size="sm" className="font-mono">
            FAILED
          </Badge>
        );
      case 'REFUNDED':
        return (
          <Badge variant="neutral" size="sm" className="font-mono">
            REFUNDED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" size="sm" className="font-mono">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
            <CreditCard className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Payments &amp; Settlements
              </h1>
              <Badge variant="outline" size="sm" withDot={false} className="font-mono">
                {pagination.totalCount.toLocaleString()} settlements
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Gateway settlement records, automated webhook receipts, and payment provider audits.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={payments.length === 0}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => void refetch()}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh Ledger
          </Button>
        </div>
      </div>

      {/* ============================================================
          EXECUTIVE KPI CARDS (StatCard System)
      ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="PAGE SETTLED VOLUME"
          value={`₹${totalSettled.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="emerald"
          trend={{
            value: '100% Cleared',
            label: 'instant settlement',
            isPositive: true,
          }}
          description="Verified gateway clearances on current ledger view"
        />

        <StatCard
          title="AUTHORIZATION RATE"
          value={`${successRate}%`}
          icon={<ShieldCheck className="h-5 w-5" />}
          accentColor="indigo"
          trend={{
            value: `${successfulCount} cleared`,
            label: `${failedCount} failures`,
            isPositive: Number(successRate) >= 90,
          }}
          description="Webhook-verified payment capture success rate"
        />

        <StatCard
          title="TOTAL SETTLEMENTS"
          value={pagination.totalCount.toLocaleString('en-IN')}
          icon={<Zap className="h-5 w-5" />}
          accentColor="purple"
          trend={{
            value: 'Dual Adapter',
            label: 'Razorpay & Stripe',
            isNeutral: true,
          }}
          description="All-time transaction ledger across all gateways"
        />

        <StatCard
          title="AWAITING / IN-FLIGHT"
          value={pendingCount}
          icon={<Clock className="h-5 w-5" />}
          accentColor="amber"
          trend={{
            value: pendingCount === 0 ? 'Zero Backlog' : `${pendingCount} in flight`,
            label: 'webhook queue',
            isPositive: pendingCount === 0,
          }}
          description="Awaiting gateway payment completion or verification"
        />
      </div>

      {/* ============================================================
          FILTER & CONTROL SUITE
      ============================================================ */}
      <Card className="p-4 shadow-xs border-border/80">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by gateway payment ID, order #, student, or course..."
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value || undefined, page: 1 })}
              className="pl-10 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => updateFilters({ search: undefined, page: 1 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'ALL', label: 'All Statuses' },
              { id: 'SUCCESS', label: 'Success', color: 'text-emerald-500' },
              { id: 'PENDING', label: 'Pending', color: 'text-amber-500' },
              { id: 'FAILED', label: 'Failed', color: 'text-rose-500' },
            ].map((tab) => {
              const currentStatus = status || 'ALL';
              const isActive = currentStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    updateFilters({
                      status: tab.id === 'ALL' ? undefined : tab.id,
                      page: 1,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/30 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
                  }`}
                >
                  {tab.color && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${tab.color.replace('text-', 'bg-')}`}
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Provider Select Dropdown */}
          <div className="w-full sm:w-52 shrink-0">
            <Select
              value={provider || 'ALL'}
              onValueChange={(val) =>
                updateFilters({
                  provider: val === 'ALL' ? undefined : val,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Providers</SelectItem>
                <SelectItem value="RAZORPAY">Razorpay (INR)</SelectItem>
                <SelectItem value="STRIPE">Stripe (Global)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Metrics Sub-strip */}
        {(search || (provider && provider !== 'ALL') || (status && status !== 'ALL')) && (
          <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 flex-wrap">
              <span>
                Showing <strong className="text-foreground">{payments.length}</strong> matching
                records
              </span>
              {provider && provider !== 'ALL' && (
                <Badge variant="outline" size="sm" withDot={false}>
                  Provider: {provider}
                </Badge>
              )}
              {status && status !== 'ALL' && (
                <Badge variant="outline" size="sm" withDot={false}>
                  Status: {status}
                </Badge>
              )}
              {search && (
                <Badge variant="outline" size="sm" withDot={false}>
                  Query: &ldquo;{search}&rdquo;
                </Badge>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                updateFilters({
                  search: undefined,
                  provider: undefined,
                  status: undefined,
                  page: 1,
                })
              }
              className="text-primary hover:underline text-[11px] font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Card>

      {/* ============================================================
          PAYMENTS AUDIT TABLE
      ============================================================ */}
      {isError ? (
        <Card className="p-12 text-center space-y-4 border-destructive/20 bg-destructive/5">
          <AlertCircle className="size-9 text-destructive mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Failed to connect to gateway settlement ledger
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              An error occurred while loading payment transactions from the billing service.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Retry Connection
          </Button>
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-48">Gateway Payment ID</TableHead>
                <TableHead className="w-28">Provider</TableHead>
                <TableHead className="min-w-48">Order Reference</TableHead>
                <TableHead className="min-w-48">Student</TableHead>
                <TableHead className="text-right w-32">Amount</TableHead>
                <TableHead className="text-center w-28">Status</TableHead>
                <TableHead className="w-40">Settled At</TableHead>
                <TableHead className="text-right w-16">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={6} cols={8} />
              ) : payments.length === 0 ? (
                <TableEmpty
                  colSpan={8}
                  title="No payment records found"
                  description={
                    search || provider || status
                      ? 'No transactions matched your search query or filter criteria.'
                      : 'Gateway transactions will automatically populate when students complete checkouts.'
                  }
                  action={
                    search || provider || status ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFilters({
                            search: undefined,
                            provider: undefined,
                            status: undefined,
                            page: 1,
                          })
                        }
                      >
                        Clear Filters
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                payments.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/25 transition-colors group"
                    onClick={() => setSelectedPayment(p)}
                  >
                    {/* Gateway Payment ID */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-semibold text-primary group-hover:underline truncate max-w-36">
                            {p.providerPaymentId}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(e, p.providerPaymentId, 'Payment ID')}
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary"
                            title="Copy Gateway ID"
                          >
                            {copiedToken === p.providerPaymentId ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground/70 truncate max-w-36">
                          ref: {p.id.slice(0, 10)}...
                        </p>
                      </div>
                    </TableCell>

                    {/* Gateway Provider */}
                    <TableCell>
                      <Badge
                        variant={p.provider === 'RAZORPAY' ? 'system' : 'custom'}
                        size="sm"
                        className="font-mono text-[10px]"
                        withDot={false}
                      >
                        {p.provider}
                      </Badge>
                    </TableCell>

                    {/* Order Details */}
                    <TableCell>
                      <div className="space-y-0.5 min-w-0 max-w-44">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span
                            className="text-xs font-medium text-foreground truncate"
                            title={p.order?.course?.title || 'Course Checkout'}
                          >
                            {p.order?.course?.title || 'Course Checkout'}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground truncate">
                          {p.order?.orderNumber || p.orderId.slice(0, 12)}
                        </p>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <div className="flex items-center gap-2.5 min-w-0 max-w-44">
                        <Avatar
                          firstName={p.order?.user?.firstName || 'Student'}
                          lastName={p.order?.user?.lastName}
                          email={p.order?.user?.email}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-xs text-foreground truncate">
                            {p.order?.user?.firstName || 'Student'} {p.order?.user?.lastName || ''}
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground truncate">
                            {p.order?.user?.email || '—'}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-right font-mono">
                      <span className="text-xs font-bold text-foreground">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70 ml-1">
                        {p.currency || 'INR'}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">{renderStatusBadge(p.status)}</TableCell>

                    {/* Settled Timestamp */}
                    <TableCell className="font-mono text-muted-foreground text-[11px]">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Clock className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                        <span>
                          {new Date(p.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-muted-foreground/50">
                          {new Date(p.createdAt).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayment(p);
                        }}
                        title="View Settlement Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <TablePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.totalCount}
              limit={pagination.limit}
              onPageChange={(newPage) => updateFilters({ page: newPage })}
              hasNext={pagination.page < pagination.totalPages}
              hasPrev={pagination.page > 1}
            />
          )}
        </div>
      )}

      {/* ============================================================
          INTERACTIVE PAYMENT SETTLEMENT INSPECTOR MODAL
      ============================================================ */}
      {selectedPayment && (
        <Modal
          isOpen={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
          title="Payment Settlement Record"
          description={`Gateway Transaction: ${selectedPayment.providerPaymentId}`}
          maxWidth="lg"
        >
          <div className="space-y-6 pt-2">
            {/* Header Settlement Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Settlement Amount</div>
                  <div className="text-2xl font-bold font-mono text-foreground">
                    ₹{selectedPayment.amount.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-medium text-muted-foreground">
                      {selectedPayment.currency || 'INR'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {renderStatusBadge(selectedPayment.status)}
                <Badge variant="outline" size="sm" withDot={false} className="font-mono">
                  {selectedPayment.provider}
                </Badge>
              </div>
            </div>

            {/* Gateway Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  Gateway Payment ID
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-foreground text-xs truncate mr-2">
                    {selectedPayment.providerPaymentId}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, selectedPayment.providerPaymentId, 'Payment ID')}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  Internal Ledger Reference
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-foreground text-xs truncate mr-2">
                    {selectedPayment.id}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, selectedPayment.id, 'Internal ID')}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Student Account
              </span>
              <div className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={selectedPayment.order?.user?.firstName || 'Student'}
                    lastName={selectedPayment.order?.user?.lastName}
                    email={selectedPayment.order?.user?.email}
                    size="md"
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {selectedPayment.order?.user?.firstName || 'Student'}{' '}
                      {selectedPayment.order?.user?.lastName || ''}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {selectedPayment.order?.user?.email || 'N/A'}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  size="sm"
                  withDot={false}
                  className="font-mono text-[10px]"
                >
                  Verified Payer
                </Badge>
              </div>
            </div>

            {/* Course & Order Connection */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Enrolled Curriculum
              </span>
              <div className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">
                      {selectedPayment.order?.course?.title || 'LMS Curriculum'}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      Order: {selectedPayment.order?.orderNumber || selectedPayment.orderId}
                    </div>
                  </div>
                </div>

                <span className="font-mono font-bold text-sm text-foreground shrink-0">
                  ₹{selectedPayment.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleCopy(e, selectedPayment.providerPaymentId, 'Gateway ID')}
                leftIcon={
                  copiedToken === selectedPayment.providerPaymentId ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
              >
                {copiedToken === selectedPayment.providerPaymentId
                  ? 'Copied Gateway ID'
                  : 'Copy Gateway ID'}
              </Button>

              <Button variant="primary" size="sm" onClick={() => setSelectedPayment(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
