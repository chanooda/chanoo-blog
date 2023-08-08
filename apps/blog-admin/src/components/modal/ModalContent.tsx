import { ReactNode, forwardRef } from 'react';
import { Stack, StackProps } from 'ui';

interface ModalContentProps extends StackProps {
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

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ noBackground = false, children, sx, ...stackProps }, ref) => {
    return (
      <Stack sx={{ ...style(noBackground), ...sx }} {...stackProps} ref={ref}>
        {children}
      </Stack>
    );
  }
);
