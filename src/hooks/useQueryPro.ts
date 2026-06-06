// 封装一个 useQuery 的 hook
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface UseQueryProOptions<
  TData = unknown,
  TError = unknown,
> extends UseQueryOptions<TData, TError> {
  frequency?: FREQUENCY_ENUM;
}

export enum FREQUENCY_ENUM {
  NOW = "NOW",
  FAST = "FAST",
  NORMAL = "NORMAL",
  SLOW = "SLOW",
}

export function useQueryPro<TData = unknown, TError = unknown>(
  _options: UseQueryProOptions<TData, TError>,
) {
  const options = { ..._options };
  options.frequency = options.frequency || FREQUENCY_ENUM.FAST;
  // 根据频率设置过期时间和缓存时间
  switch (options.frequency) {
    case FREQUENCY_ENUM.FAST:
      options.staleTime = 0; // 0 秒
      options.gcTime = 60 * 1000; // 1分
      break;
    case FREQUENCY_ENUM.NORMAL:
      options.staleTime = 1 * 60 * 1000; // 1 分
      options.gcTime = 5 * 60 * 1000; // 5分
      break;
    case FREQUENCY_ENUM.SLOW:
      options.staleTime = 1 * 60 * 1000; // 5分
      options.gcTime = 5 * 60 * 1000; // 10 分
      break;
  }

  options.retry = options.retry ?? false; // 默认不重试

  return useQuery<TData, TError>({
    refetchOnWindowFocus: false,
    ...options,
  });
}
