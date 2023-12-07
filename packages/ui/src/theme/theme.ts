import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    background: {
      default: '#f8f9fa'
    },
    primary: {
      main: '#212529',
      '100': '#f8f9fa',
      '200': '#e9ecef',
      '300': '#dee2e6',
      '400': '#ced4da',
      '500': '#adb5bd',
      '600': '#6c757d',
      '700': '#495057',
      '800': '#343a40',
      '900': '#212529'
    }
  },
  typography: {
    fontFamily: ['Noto Sans KR', 'sans-serif'].join(',')
  }
});
