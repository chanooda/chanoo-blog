'use client';

import React, { ReactNode } from 'react';
import { ThemeRegistry } from 'ui';

interface ThemeRegistryProps {
  children: ReactNode;
}
export function ServerThemeRegistry({ children }: ThemeRegistryProps) {
  return <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>;
}
