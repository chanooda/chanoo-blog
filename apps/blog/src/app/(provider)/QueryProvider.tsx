"use client";

import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

interface QueryProviderProps {
	children: ReactNode;
}
export function QueryProvider({ children }: QueryProviderProps) {
	const client = new QueryClient({
		queryCache: new QueryCache({
			onError(error, query) {
				query.fetch();
			},
		}),
		mutationCache: new MutationCache({
			onError(error, variables, context, mutation) {
				// mutation.execute();
			},
		}),
		defaultOptions: {
			mutations: {
				retry: false,
			},
			queries: {
				retry: false,
				refetchOnWindowFocus: false,
			},
		},
	});

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
