'use client';

import React from 'react';
import { GlobalStyles } from 'ui';

export function GlobalStyle() {
  return (
    <GlobalStyles
      styles={(theme) => ({
        html: {
          backgroundColor: theme.palette.background.default,
          width: '100%',
          height: '100%'
        },
        'html,body': {
          width: '100%',
          height: '100%'
        }
      })}
    />
  );
}
