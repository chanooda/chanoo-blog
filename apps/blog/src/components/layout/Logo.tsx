'use client';

import React from 'react';
import { Typography } from 'ui';

export function Logo() {
  return (
    <Typography
      variant="h1"
      sx={{
        fontSize: '30px',
        fontWeight: 600,
        cursor: 'pointer',
        verticalAlign: 'bottom',
        lineHeight: 1
      }}
    >
      Chanoo
    </Typography>
  );
}
