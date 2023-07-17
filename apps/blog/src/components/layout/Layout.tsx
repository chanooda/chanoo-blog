'use client';

import React, { ReactNode } from 'react';
import { Stack } from 'ui';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Stack height="100%" maxWidth={1024} mx="auto" width="100%">
      <Header />
      <Stack
        bgcolor="gray"
        component="main"
        height="100%"
        sx={{ overflowY: 'scroll', minHeight: '100%' }}
        width="100%"
      >
        <Stack p={2}>{children}</Stack>
      </Stack>
    </Stack>
  );
}
