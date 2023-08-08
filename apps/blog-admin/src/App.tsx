import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'ui';
import { Router } from './Router';
import { GlobalError } from './types/global';

const router = createBrowserRouter([{ path: '*', Component: Router }]);

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const client = new QueryClient({
    queryCache: new QueryCache({
      onError(error, query) {},
      onSuccess(data, query) {}
    }),

    mutationCache: new MutationCache({
      onError(error) {
        const convertedError = error as AxiosError<GlobalError>;
        if (convertedError?.response?.data?.error)
          enqueueSnackbar(convertedError?.response?.data?.error, { variant: 'error' });
      },
      onSuccess() {}
    }),

    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false
      },
      mutations: {
        retry: false
      }
    }
  });

  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
