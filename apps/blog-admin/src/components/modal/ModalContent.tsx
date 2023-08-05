import { ReactNode } from 'react';
import { Stack } from 'ui';

interface ModalContentProps {
  children: ReactNode;
  noBackground?: boolean;
}

const style = (noBackground?: boolean) => ({
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  ...(!noBackground && { p: 2, borderRadius: 1 })
});

export function ModalContent({ children, noBackground = false }: ModalContentProps) {
  return <Stack sx={style(noBackground)}>{children}</Stack>;
}
