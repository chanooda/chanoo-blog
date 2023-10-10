'use client';

import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    background: {
      default: '#fff'
    }
  },
  typography: {
    fontFamily: ['Noto Sans KR', 'sans-serif'].join(',')
  }
});
