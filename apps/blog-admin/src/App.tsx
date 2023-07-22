import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, theme } from 'ui';
import { Router } from './Router';
import { GlobalStyle } from './components/style/GlobalStyle';

const router = createBrowserRouter([{ path: '*', Component: Router }]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
