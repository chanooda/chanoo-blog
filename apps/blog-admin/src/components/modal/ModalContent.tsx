import React, { ReactNode } from 'react';
import { Stack } from 'ui';

interface ModalContentProps {
  children: ReactNode;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 1
};

export function ModalContent({ children }: ModalContentProps) {
  return <Stack sx={style}>{children}</Stack>;
}
