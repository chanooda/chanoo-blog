import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { Router } from './Router';

const router = createBrowserRouter([{ path: '*', Component: Router }]);

function App() {
  const client = new QueryClient({
    queryCache: new QueryCache({
      onError(error, query) {},
      onSuccess(data, query) {}
    }),

    mutationCache: new MutationCache({
      onError(error) {},
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
