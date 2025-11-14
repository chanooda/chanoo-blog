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
import type { GlobalError, GlobalResponse } from "../../types/global";
import { useAuth } from "../contexts/AuthContext";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_APP_BLOG_ADMIN_BASE_URL || "",
});

export const useChanooQuery = <
	TQueryFnData = unknown,
	TError = unknown,
	TData = AxiosResponse<GlobalResponse<TQueryFnData>>,
	TQueryKey extends QueryKey = QueryKey,
>(
	queryKey: TQueryKey,
	_options?: Omit<
		UseQueryOptions<
			TQueryFnData,
			AxiosError<GlobalError<TError>>,
			TData,
			TQueryKey
		>,
		"initialData" | "queryKey"
	> & {
		initialData?: () => undefined;
	},
): UseQueryResult<TData, AxiosError<GlobalError<TError>>> => {
	const queryUrl = typeof queryKey[0] === "string" ? queryKey[0] : "";
	const queryParams = typeof queryKey[1] === "object" ? queryKey[1] : {};

	const { throwOnError, ...options } = _options || {};

	const { token } = useAuth();

	const query = useQuery<
		TQueryFnData,
		AxiosError<GlobalError<TError>>,
		TData,
		TQueryKey
	>({
		queryKey,
		queryFn: async () =>
			axiosClient.request({
				method: "get",
				url: queryUrl,
				params: queryParams,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		throwOnError: (error, query) => {
			// queryCache.onError가 실행되도록 하기 위해 먼저 false를 반환
			// 그 다음에 throwOnError 옵션에 따라 결정
			if (error?.response?.data?.code === "UNAUTHORIZED") {
				return false;
			}

			// throwOnError가 명시적으로 설정된 경우에만 그 값을 사용
			// 설정되지 않은 경우 false를 반환하여 queryCache.onError가 실행되도록 함
			if (throwOnError !== undefined) {
				if (typeof throwOnError === "function") {
					return throwOnError(error, query);
				}
				return throwOnError;
			}

			// 기본값을 false로 변경하여 queryCache.onError가 실행되도록 함
			return false;
		},
		...options,
	});

	return query;
};

export type MutationKey<TVariables> = [
	Method,
	((data: TVariables) => string) | string,
	(((data: TVariables) => unknown) | undefined)?,
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
