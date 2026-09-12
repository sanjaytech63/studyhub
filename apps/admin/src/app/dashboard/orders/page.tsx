'use client';

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownRight,
  TrendingUp,
  RefreshCw,
  Download,
  Copy,
  Check,
  Eye,
  Receipt,
  GraduationCap,
  X,
  CreditCard,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAdminOrders } from '@/lib/admin/lms.queries';
import type { AdminOrder } from '@/services/admin-lms.service';
import { useUrlFilters } from '@/hooks/use-url-filters';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/data-table';

export default function AdminOrdersPage() {
  const { filters, updateFilters } = useUrlFilters<{
    search?: string;
    status?: string;
    page?: number;
  }>();

  const search = filters.search || '';
  const statusFilter = filters.status || 'ALL';

  const { data: orders = [], isLoading, isError, refetch, isRefetching } = useAdminOrders();

  // State for inspecting an order receipt
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered dataset
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.user.email.toLowerCase().includes(q) ||
        `${o.user.firstName} ${o.user.lastName || ''}`.toLowerCase().includes(q) ||
        o.course.title.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Executive KPI calculations
  const paidOrders = useMemo(() => orders.filter((o) => o.status === 'PAID'), [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'PENDING'), [orders]);
  const failedOrders = useMemo(
    () => orders.filter((o) => o.status === 'FAILED' || o.status === 'CANCELLED'),
    [orders],
  );

  const totalRevenue = useMemo(
    () => paidOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0),
    [paidOrders],
  );

  const totalDiscount = useMemo(
    () => paidOrders.reduce((acc, o) => acc + (o.discountAmount || 0), 0),
    [paidOrders],
  );

  const averageOrderValue = useMemo(() => {
    if (paidOrders.length === 0) return 0;
    return Math.round(totalRevenue / paidOrders.length);
  }, [paidOrders.length, totalRevenue]);

  const conversionRate = useMemo(() => {
    if (orders.length === 0) return '0.0';
    return ((paidOrders.length / orders.length) * 100).toFixed(1);
  }, [orders.length, paidOrders.length]);

  // Copy order number handler
  const handleCopyOrderNumber = (e: React.MouseEvent, orderNumber: string) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(orderNumber);
    setCopiedId(orderNumber);
    toast.success(`Copied "${orderNumber}" to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No transactions available to export');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Email',
      'Course Title',
      'Subtotal Amount',
      'Discount Amount',
      'Total Paid',
      'Currency',
      'Status',
    ];

    const rows = filtered.map((o) => [
      o.orderNumber,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.user.firstName} ${o.user.lastName || ''}".trim()`,
      o.user.email,
      `"${o.course.title.replace(/"/g, '""')}"`,
      o.subtotalAmount ?? o.totalAmount,
      o.discountAmount ?? 0,
      o.totalAmount,
      o.currency || 'INR',
      o.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `studyhub-orders-ledger-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filtered.length} transactions to CSV`);
  };

  // Status badge helper
  const renderStatusBadge = (status: AdminOrder['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <Badge variant="active" size="sm" className="font-mono">
            PAID
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="suspended" size="sm" className="font-mono">
            PENDING
          </Badge>
        );
      case 'FAILED':
      case 'CANCELLED':
        return (
          <Badge variant="deleted" size="sm" className="font-mono">
            {status}
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
          EXECUTIVE HEADER
      ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
            <ShoppingBag className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Orders &amp; Transactions
              </h1>
              <Badge variant="outline" size="sm" withDot={false} className="font-mono">
                {orders.length} total
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Financial ledger, checkout conversions, discount analytics, and student billing
              records.
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => refetch()}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh Ledger
          </Button>
        </div>
      </div>

      {/* ============================================================
          EXECUTIVE KPI CARDS RIBBON (StatCard System)
      ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="PROCESSED REVENUE"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="emerald"
          trend={{
            value: '+18.4%',
            label: 'conversion rate',
            isPositive: true,
          }}
          description={`Net collected from ${paidOrders.length} completed transactions`}
        />

        <StatCard
          title="TOTAL COUPON DISCOUNTS"
          value={`₹${totalDiscount.toLocaleString('en-IN')}`}
          icon={<ArrowDownRight className="h-5 w-5" />}
          accentColor="purple"
          trend={{
            value: `${totalRevenue > 0 ? ((totalDiscount / (totalRevenue + totalDiscount)) * 100).toFixed(1) : 0}%`,
            label: 'discount ratio',
            isNeutral: true,
          }}
          description="Applied promotional codes and referral vouchers"
        />

        <StatCard
          title="CHECKOUT CONVERSIONS"
          value={paidOrders.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accentColor="indigo"
          trend={{
            value: `${conversionRate}%`,
            label: 'completion rate',
            isPositive: Number(conversionRate) >= 50,
          }}
          description={`Out of ${orders.length} total initiated transactions`}
        />

        <StatCard
          title="AVERAGE TICKET (AOV)"
          value={`₹${averageOrderValue.toLocaleString('en-IN')}`}
          icon={<CreditCard className="h-5 w-5" />}
          accentColor="amber"
          trend={{
            value: `${pendingOrders.length} pending`,
            label: `${failedOrders.length} failed/cancelled`,
            isNeutral: true,
          }}
          description="Average transaction size per student checkout"
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
              placeholder="Search by order ID, student name, email, or course..."
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
              { id: 'ALL', label: 'All Orders', count: orders.length },
              { id: 'PAID', label: 'Paid', count: paidOrders.length, color: 'text-emerald-500' },
              {
                id: 'PENDING',
                label: 'Pending',
                count: pendingOrders.length,
                color: 'text-amber-500',
              },
              { id: 'FAILED', label: 'Failed', count: failedOrders.length, color: 'text-rose-500' },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
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
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Status Select Dropdown (for full responsive flexibility) */}
          <div className="w-full sm:w-52 shrink-0">
            <Select
              value={statusFilter}
              onValueChange={(val) =>
                updateFilters({
                  status: val === 'ALL' ? undefined : val,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses ({orders.length})</SelectItem>
                <SelectItem value="PAID">Paid ({paidOrders.length})</SelectItem>
                <SelectItem value="PENDING">Pending ({pendingOrders.length})</SelectItem>
                <SelectItem value="FAILED">Failed ({failedOrders.length})</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Metrics Sub-strip */}
        {(search || statusFilter !== 'ALL') && (
          <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                Showing <strong className="text-foreground">{filtered.length}</strong> of{' '}
                <strong className="text-foreground">{orders.length}</strong> records
              </span>
              {statusFilter !== 'ALL' && (
                <Badge variant="outline" size="sm" withDot={false}>
                  Status: {statusFilter}
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
              onClick={() => updateFilters({ search: undefined, status: undefined, page: 1 })}
              className="text-primary hover:underline text-[11px] font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Card>

      {/* ============================================================
          FINANCIAL LEDGER TABLE
      ============================================================ */}
      {isError ? (
        <Card className="p-12 text-center space-y-4 border-destructive/20 bg-destructive/5">
          <AlertCircle className="size-9 text-destructive mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Failed to connect to billing service
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              An error occurred while loading the financial ledger from the backend gateway.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Retry Connection
          </Button>
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-44">Transaction ID</TableHead>
                <TableHead className="min-w-52">Student / Customer</TableHead>
                <TableHead className="min-w-50">Purchased Course</TableHead>
                <TableHead className="text-right">Net Paid</TableHead>
                <TableHead className="text-center w-30">Status</TableHead>
                <TableHead className="w-40">Timestamp</TableHead>
                <TableHead className="text-right w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={6} cols={7} />
              ) : filtered.length === 0 ? (
                <TableEmpty
                  colSpan={7}
                  title="No transactions found"
                  description={
                    search || statusFilter !== 'ALL'
                      ? 'No orders matched your current query or filter criteria.'
                      : 'Transactions and student enrollments will automatically be logged here in real-time.'
                  }
                  action={
                    search || statusFilter !== 'ALL' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFilters({ search: undefined, status: undefined, page: 1 })
                        }
                      >
                        Clear Filters
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                filtered.map((order) => {
                  const hasDiscount = order.discountAmount > 0;
                  const originalPrice =
                    (order.subtotalAmount || order.totalAmount) + (order.discountAmount || 0);

                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/25 transition-colors group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Order Number & Copy Token */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold text-primary group-hover:underline">
                            {order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyOrderNumber(e, order.orderNumber)}
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
                            title="Copy Order ID"
                          >
                            {copiedId === order.orderNumber ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Customer Info with Avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            firstName={order.user.firstName}
                            lastName={order.user.lastName}
                            email={order.user.email}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-xs text-foreground truncate">
                              {order.user.firstName} {order.user.lastName ?? ''}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground truncate">
                              {order.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Purchased Course */}
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <GraduationCap className="h-3.5 w-3.5" />
                          </div>
                          <span
                            className="text-xs font-medium text-foreground truncate max-w-40"
                            title={order.course.title}
                          >
                            {order.course.title}
                          </span>
                        </div>
                      </TableCell>

                      {/* Amount & Discount Breakdown */}
                      <TableCell className="text-right font-mono">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-foreground">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-muted-foreground line-through">
                                ₹{originalPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                                <Percent className="h-2.5 w-2.5" />
                                Saved ₹{order.discountAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="text-center">
                        {renderStatusBadge(order.status)}
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell className="font-mono text-muted-foreground text-[11px]">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Clock className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-muted-foreground/50">
                            {new Date(order.createdAt).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </TableCell>

                      {/* Quick Inspect Action */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="iconSm"
                          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          title="View Order Receipt"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ============================================================
          INTERACTIVE ORDER INSPECTION DRAWER / RECEIPT MODAL
      ============================================================ */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title="Transaction Receipt"
          description={`Order Reference: ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-6 pt-2">
            {/* Header Strip with Status and Amount */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Amount Paid</div>
                  <div className="text-2xl font-bold font-mono text-foreground">
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {renderStatusBadge(selectedOrder.status)}
                <div className="text-xs text-muted-foreground font-mono">
                  {new Date(selectedOrder.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Customer Details
              </span>
              <div className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={selectedOrder.user.firstName}
                    lastName={selectedOrder.user.lastName}
                    email={selectedOrder.user.email}
                    size="md"
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {selectedOrder.user.firstName} {selectedOrder.user.lastName ?? ''}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {selectedOrder.user.email}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  size="sm"
                  withDot={false}
                  className="font-mono text-[10px]"
                >
                  Verified Student
                </Badge>
              </div>
            </div>

            {/* Line Item Receipt */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Itemized Summary
              </span>
              <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
                <div className="p-4 flex items-center justify-between gap-4 border-b border-border/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">
                        {selectedOrder.course.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Full Lifetime Access &amp; Certification
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-xs text-foreground">
                    ₹
                    {(
                      (selectedOrder.subtotalAmount || selectedOrder.totalAmount) +
                      (selectedOrder.discountAmount || 0)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Subtotal & Discounts */}
                <div className="p-4 space-y-2 bg-muted/10 text-xs font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base Course Price:</span>
                    <span>
                      ₹
                      {(
                        (selectedOrder.subtotalAmount || selectedOrder.totalAmount) +
                        (selectedOrder.discountAmount || 0)
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-medium">
                      <span>Coupon Discount Applied:</span>
                      <span>-₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Service Fee:</span>
                    <span>₹0 (Included)</span>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex justify-between text-sm font-bold text-foreground">
                    <span>Grand Total:</span>
                    <span className="text-primary">
                      ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}{' '}
                      {selectedOrder.currency || 'INR'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleCopyOrderNumber(e, selectedOrder.orderNumber)}
                leftIcon={
                  copiedId === selectedOrder.orderNumber ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
              >
                {copiedId === selectedOrder.orderNumber ? 'Copied Order #' : 'Copy Order #'}
              </Button>

              <Button variant="primary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
