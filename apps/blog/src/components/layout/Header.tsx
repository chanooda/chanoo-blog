import React from 'react';
import { Stack, Typography, theme } from 'ui';
import { NextLink } from '@Components/common/NextLink';
import { Logo } from './Logo';

export function Header() {
  return (
    <Stack
      alignItems="center"
      bgcolor={theme.palette.background.default}
      component="header"
      direction="row"
      height={80}
      minHeight={80}
      px={3}
      width="100%"
    >
      <Stack alignItems="flex-end" direction="row" maxWidth={1024} mx="auto" width="100%">
        <NextLink href="/">
          <Logo />
        </NextLink>
        <Stack direction="row" ml={2} spacing={2}>
          <NextLink href="/post">
            <Typography fontWeight={500} variant="body1">
              post
            </Typography>
          </NextLink>
          <NextLink href="/series">
            <Typography fontWeight={500} variant="body1">
              series
            </Typography>
          </NextLink>
        </Stack>
      </Stack>
    </Stack>
  );
}
