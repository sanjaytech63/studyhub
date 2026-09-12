'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from './button';

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex flex-1 items-center text-left line-clamp-1', className)}
      {...props}
    />
  );
}

export interface SelectTriggerProps extends SelectPrimitive.Trigger.Props {
  size?: 'sm' | 'default';
  error?: string;
}

function SelectTrigger({
  className,
  size = 'default',
  error,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <div className="relative w-full">
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size={size}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3.5 py-2 text-xs text-foreground transition-all duration-150 cursor-pointer outline-none select-none',
          'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:bg-secondary/70',
          'disabled:cursor-not-allowed disabled:opacity-50',
          size === 'sm' && 'h-8 text-xs px-2.5',
          error &&
            'border-destructive/80 focus-visible:border-destructive focus-visible:ring-destructive/25',
          className,
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon
          render={
            <ChevronDownIcon className="pointer-events-none h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          }
        />
      </SelectPrimitive.Trigger>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly error?: string;
  readonly leftIcon?: React.ReactNode;
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, error, leftIcon, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full items-center rounded-lg border border-border/80 bg-secondary/40 px-3.5 py-2 text-xs text-foreground transition-all duration-150 cursor-pointer appearance-none outline-none select-none',
            'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:bg-secondary/70',
            'disabled:cursor-not-allowed disabled:opacity-50 pr-9',
            leftIcon && 'pl-9',
            error &&
              'border-destructive/80 focus-visible:border-destructive focus-visible:ring-destructive/25',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
          <ChevronDownIcon className="h-4 w-4" />
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);

NativeSelect.displayName = 'NativeSelect';

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            'relative isolate z-50 max-h-72 w-(--anchor-width) min-w-[8rem] overflow-hidden rounded-lg border border-border/80 bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl p-1',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="p-0.5 space-y-0.5">{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg py-1.5 px-2.5 text-sm text-foreground outline-none select-none transition-colors',
        'data-[highlighted]:bg-secondary data-[highlighted]:text-foreground',
        'data-[selected]:bg-primary/15 data-[selected]:text-primary data-[selected]:font-medium',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex items-center gap-2">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="flex h-4 w-4 items-center justify-center text-primary">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
        }
      />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border/60', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        'top-0 z-10 flex w-full cursor-default items-center justify-center bg-card py-1 text-muted-foreground',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        'bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-card py-1 text-muted-foreground',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
