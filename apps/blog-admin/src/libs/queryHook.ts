import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery
} from '@tanstack/react-query';
import { GlobalResponse } from '../types/global';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BLOG_ADMIN_BASE_URL
});

export const useChanooQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = AxiosResponse<GlobalResponse<TQueryFnData>>,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'initialData'> & {
    initialData?: () => undefined;
  }
) => {
  const queryUrl = typeof queryKey[0] === 'string' ? queryKey[0] : '';
  const queryParams = typeof queryKey[1] === 'object' ? queryKey[1] : {};
  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn: async () => {
      return axiosClient.request({
        method: 'get',
        url: queryUrl,
        params: queryParams
      });
    },
    ...options
  });

  return query;
};

export type MutationKey<TVariables> = [
  Method,
  ((data: TVariables) => string) | string,
  (data: TVariables) => unknown
];

export const useChanooMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey<TVariables>,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<TError>, TVariables, TContext>,
    'mutationFn' | 'mutationKey'
  >
) => {
  const mutation = useMutation<TData, AxiosError<TError>, TVariables, TContext>({
    mutationKey,
    mutationFn: (variables) => {
      const keyCopy: MutationKey<TVariables> = [...mutationKey];

      return axiosClient.request({
        method: keyCopy[0],
        url: typeof keyCopy[1] === 'function' ? keyCopy[1](variables) : keyCopy[1],
        data: keyCopy[2](variables)
      });
    },
    ...options
  });

  return mutation;
};
