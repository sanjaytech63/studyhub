'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  roleId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | undefined;
}

export function useUrlFilters<T extends FilterParams = FilterParams>(defaults?: Partial<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const params: Record<string, string | number | undefined> = { ...defaults };
    searchParams.forEach((val, key) => {
      if (key === 'page' || key === 'limit') {
        const num = Number(val);
        if (!isNaN(num) && num > 0) {
          params[key] = num;
        }
      } else {
        params[key] = val;
      }
    });
    return params as T;
  }, [searchParams, defaults]);

  const updateFilters = useCallback(
    (newFilters: Partial<Record<keyof T, string | number | undefined | null>>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || value === 'ALL') {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      // When search or filter changes and page isn't explicitly passed, reset to page 1
      if (
        !('page' in newFilters) &&
        current.has('page') &&
        (newFilters.search !== undefined ||
          newFilters.status !== undefined ||
          newFilters.roleId !== undefined)
      ) {
        current.set('page', '1');
      }

      const queryString = current.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
