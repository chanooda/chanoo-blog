import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, SnackbarProvider, ThemeProvider, theme } from 'ui';
import App from './App';
import { GlobalStyle } from './components/style/GlobalStyle';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle />
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
