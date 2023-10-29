import React from 'react';
import { Stack, Typography } from 'ui';
import { Logo } from './Logo';

export function Header() {
  return (
    <Stack
      alignItems="flex-end"
      component="header"
      direction="row"
      height={80}
      minHeight={80}
      px={6}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.divider}`
      })}
    >
      <Logo />
      <Stack direction="row" ml={2} spacing={2}>
        <Stack component="nav" sx={{ cursor: 'pointer' }}>
          <Typography fontWeight={500} variant="body1">
            writes
          </Typography>
        </Stack>
        <Stack component="nav" sx={{ cursor: 'pointer' }}>
          <Typography fontWeight={500} variant="body1">
            writes
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
