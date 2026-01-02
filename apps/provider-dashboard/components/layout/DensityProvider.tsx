// apps/provider-dashboard/components/layout/DensityProvider.tsx

import { createContext, useContext, ReactNode } from 'react';

export type DensityMode = 'comfortable' | 'compact';

interface DensityContextType {
  mode: DensityMode;
  isCompact: boolean;
  textSize: string;
  headingSize: string;
  subHeadingSize: string;
  padding: string;
  innerPadding: string;
  gap: string;
  rounded: string;
  shadow: string;
}

const DensityContext = createContext<DensityContextType>({
  mode: 'comfortable',
  isCompact: false,
  textSize: 'text-base',
  headingSize: 'text-2xl',
  subHeadingSize: 'text-xl',
  padding: 'p-8',
  innerPadding: 'p-6',
  gap: 'gap-8',
  rounded: 'rounded-[3rem]',
  shadow: 'shadow-2xl',
});

interface DensityProviderProps {
  density: DensityMode;
  children: ReactNode;
}

export function DensityProvider({ density, children }: DensityProviderProps) {
  const value = {
    mode: density,
    isCompact: density === 'compact',
    textSize: density === 'compact' ? 'text-sm' : 'text-base',
    headingSize: density === 'compact' ? 'text-lg' : 'text-2xl',
    subHeadingSize: density === 'compact' ? 'text-base' : 'text-xl',
    padding: density === 'compact' ? 'p-4' : 'p-8',
    innerPadding: density === 'compact' ? 'p-3' : 'p-6',
    gap: density === 'compact' ? 'gap-4' : 'gap-8',
    rounded: density === 'compact' ? 'rounded-2xl' : 'rounded-[3rem]',
    shadow: density === 'compact' ? 'shadow' : 'shadow-2xl',
  };

  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;
}

export const useDensityContext = () => useContext(DensityContext);