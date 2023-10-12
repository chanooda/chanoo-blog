'use client';

import React from 'react';
import { Typography } from 'ui';

export function Logo() {
  return (
    <Typography
      variant="h1"
      sx={{
        fontSize: 32,
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      Chanoo
    </Typography>
  );
}
