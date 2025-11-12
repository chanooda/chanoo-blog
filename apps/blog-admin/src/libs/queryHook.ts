import {
	type QueryKey,
	type UseMutationOptions,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
	type Method,
} from "axios";
import type { GlobalError, GlobalResponse } from "../types/global";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_APP_BLOG_ADMIN_BASE_URL || "",
});

export const useChanooQuery = <
	TQueryFnData = unknown,
	TError = AxiosError<GlobalError>,
	TData = AxiosResponse<GlobalResponse<TQueryFnData>>,
	TQueryKey extends QueryKey = QueryKey,
>(
	queryKey: TQueryKey,
	options?: Omit<
		UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
		"initialData" | "queryKey"
	> & {
		initialData?: () => undefined;
	},
): UseQueryResult<TData, TError> => {
	const queryUrl = typeof queryKey[0] === "string" ? queryKey[0] : "";
	const queryParams = typeof queryKey[1] === "object" ? queryKey[1] : {};
	const query = useQuery<TQueryFnData, TError, TData, TQueryKey>({
		queryKey,
		queryFn: async () => {
			return axiosClient.request({
				method: "get",
				url: queryUrl,
				params: queryParams,
			});
		},
		throwOnError: true,
		...options,
	});

	return query;
};

export type MutationKey<TVariables> = [
	Method,
	((data: TVariables) => string) | string,
	((data: TVariables) => unknown) | undefined,
];

export const useChanooMutation = <
	TData = unknown,
	TError = unknown,
	TVariables = void,
	TContext = unknown,
>(
	mutationKey: MutationKey<TVariables>,
	options?: Omit<
		UseMutationOptions<
			AxiosResponse<GlobalResponse<TData>>,
			AxiosError<TError>,
			TVariables,
			TContext
		>,
		"mutationFn" | "mutationKey"
	>,
	axiosOption?: AxiosRequestConfig,
) => {
	const mutation = useMutation<
		AxiosResponse<GlobalResponse<TData>>,
		AxiosError<TError>,
		TVariables,
		TContext
	>({
		mutationKey,
		mutationFn: (variables: TVariables) => {
			const keyCopy: MutationKey<TVariables> = [...mutationKey];

			return axiosClient.request({
				method: keyCopy[0],
				url:
					typeof keyCopy[1] === "function" ? keyCopy[1](variables) : keyCopy[1],
				data: keyCopy[2] ? keyCopy[2](variables) : undefined,
				...axiosOption,
			});
		},
		...options,
	});

	return mutation;
};
