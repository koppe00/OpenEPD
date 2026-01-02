// apps/provider-dashboard/hooks/useDensity.ts

import { useMemo } from 'react';

export type DensityMode = 'comfortable' | 'compact';

export function useDensity(density?: DensityMode) {
  const mode = density || 'comfortable';

  return useMemo(() => ({
    mode,
    isCompact: mode === 'compact',
    textSize: mode === 'compact' ? 'text-sm' : 'text-base',
    headingSize: mode === 'compact' ? 'text-lg' : 'text-2xl',
    subHeadingSize: mode === 'compact' ? 'text-base' : 'text-xl',
    padding: mode === 'compact' ? 'p-4' : 'p-8',
    innerPadding: mode === 'compact' ? 'p-3' : 'p-6',
    gap: mode === 'compact' ? 'gap-4' : 'gap-8',
    rounded: mode === 'compact' ? 'rounded-2xl' : 'rounded-[3rem]',
    shadow: mode === 'compact' ? 'shadow' : 'shadow-2xl',
  }), [mode]);
}