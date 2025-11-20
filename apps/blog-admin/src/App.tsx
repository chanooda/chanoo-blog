import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Router } from "./Router";
import type { GlobalError } from "./types/global";

const router = createBrowserRouter([{ path: "*", Component: Router }]);

function App() {
	const { enqueueSnackbar } = useSnackbar();

	const [queryClient] = useState(() => {
		const client = new QueryClient({
			queryCache: new QueryCache({
				onError(error, query) {
					location.href = "/signin";
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
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
