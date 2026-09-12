'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { cn } from './button';
import { Button } from './button';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  readonly containerClassName?: string;
}

export function Table({ className, containerClassName, children, ...props }: TableProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg border border-border/80 bg-card shadow-xs',
        containerClassName,
      )}
    >
      <div className="overflow-x-auto">
        <table className={cn('w-full caption-bottom text-xs', className)} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'border-b border-border/60 bg-muted/25 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono',
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-border/40', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors duration-150 hover:bg-muted/30 data-[state=selected]:bg-muted/50',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0 text-foreground', className)}
      {...props}
    >
      {children}
    </td>
  );
}

export interface TableEmptyProps {
  readonly title?: string;
  readonly description?: string;
  readonly colSpan?: number;
  readonly action?: React.ReactNode;
}

export function TableEmpty({
  title = 'No records found',
  description = 'Try adjusting your search or filter parameters.',
  colSpan = 6,
  action,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex h-10 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="h-6 w-6 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </td>
    </tr>
  );
}

export interface TableSkeletonProps {
  readonly rows?: number;
  readonly cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <div
                className="h-4 rounded bg-muted/60 animate-pulse"
                style={{ width: `${Math.floor(40 + (((i + j) * 17) % 50))}%` }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export interface TablePaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly total: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

export function TablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  hasNext,
  hasPrev,
}: TablePaginationProps) {
  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
      <div className="font-mono text-center sm:text-left">
        Showing <span className="font-semibold text-foreground">{start}</span> to{' '}
        <span className="font-semibold text-foreground">{end}</span> of{' '}
        <span className="font-semibold text-foreground">{total}</span> records
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono mr-2">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="outline"
          size="iconSm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="iconSm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
