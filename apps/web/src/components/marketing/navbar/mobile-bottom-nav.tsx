'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';

import { navItems } from './navigation';

import { useMobileNavigation } from './mobile-navigation-provider';

export function MobileBottomNav() {
  const pathname = usePathname();

  const { isMoreOpen, openMore } = useMobileNavigation();

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className={['fixed inset-x-0 bottom-3 z-50', 'flex justify-center', 'px-4', 'md:hidden'].join(
        ' ',
      )}
    >
      <div
        className={[
          'flex h-14 w-full max-w-md',
          'items-center',
          'gap-1',
          'rounded-full',
          'border border-border/70',
          'bg-background/75',
          'px-1',
          'shadow-xl shadow-black/10',
          'backdrop-blur-2xl',
          'supports-backdrop-filter:bg-background/60',
        ].join(' ')}
      >
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;

          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex h-11 min-w-0 flex-1',
                'flex-col items-center justify-center',
                'gap-0.5',
                'rounded-full',
                'transition-all duration-200',

                isActive
                  ? ['bg-primary', 'text-primary-foreground', ''].join(' ')
                  : [
                      'text-muted-foreground',
                      'hover:bg-accent',
                      'hover:text-accent-foreground',
                    ].join(' '),
              ].join(' ')}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />

              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}

        {/* More */}
        <button
          type="button"
          onClick={openMore}
          aria-label="Open more navigation"
          aria-haspopup="dialog"
          aria-expanded={isMoreOpen}
          className={[
            'flex h-11 min-w-0 flex-1',
            'flex-col items-center justify-center',
            'rounded-full',
            'gap-0.5',
            'transition-all duration-200',

            isMoreOpen
              ? ['bg-primary', 'text-primary-foreground'].join(' ')
              : ['text-muted-foreground', 'hover:bg-accent', 'hover:text-accent-foreground'].join(
                  ' ',
                ),
          ].join(' ')}
        >
          <MoreHorizontal aria-hidden="true" className="size-4 shrink-0" />

          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </div>
    </nav>
  );
}
