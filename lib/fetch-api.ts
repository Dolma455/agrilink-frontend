// services/fetch.api.ts
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// Generic fetch function
const fetchData = async <T = any>(url: string): Promise<T> => {
  const response = await axiosInstance.get<T>(url);
  return response.data;
};

// Generic post function
const postData = async <T = any, D = any>(url: string, data: D): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data);
  return response.data;
};

// Custom hook for GET
export const useFetchQuery = <T = any>(
  key: string,
  url: string,
  options?: UseQueryOptions<T>
) => {
  return useQuery<T>({
    queryKey: [key],
    queryFn: () => fetchData<T>(url),
    ...options,
  });
};

// Custom hook for POST
export const usePostMutation = <T = any, D = any>(
  url: string,
  options?: UseMutationOptions<T, unknown, D>
) => {
  return useMutation<T, unknown, D>({
    mutationFn: (data: D) => postData<T, D>(url, data),
    ...options,
  });
};
