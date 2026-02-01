import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { type AxiosError, isAxiosError } from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./apps/provider/ThemeProvider";
import { Router } from "./Router";
import type { GlobalError } from "./types/global";

const router = createBrowserRouter([{ path: "*", Component: Router }]);

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [queryClient] = useState(() => {
    const client = new QueryClient({
      queryCache: new QueryCache({
        onError(error) {
          if (isAxiosError(error)) {
            if (error.response?.status === 401) {
              location.href = "/signin";
            }
          }
        },
        onSuccess(data, query) {},
      }),

      mutationCache: new MutationCache({
        onError(error) {
          const convertedError = error as AxiosError<GlobalError>;
          if (convertedError?.response?.data)
            enqueueSnackbar(convertedError?.response?.data?.message, {
              variant: "error",
            });
        },
        onSuccess() {},
      }),

      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
