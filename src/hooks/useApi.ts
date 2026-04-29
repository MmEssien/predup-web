"use client";

import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  immediate?: boolean;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await fetchFn();
      setState({ data, loading: false, error: null });
      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      options.onError?.(errorMessage);
      throw err;
    }
  }, [fetchFn, options]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

// Hook for polling data
export function usePolling<T>(
  fetchFn: () => Promise<T>,
  intervalMs: number = 60000,
  options: UseApiOptions<T> = {}
) {
  const [isPolling, setIsPolling] = useState(false);
  const api = useApi<T>(fetchFn, options);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    api.execute();
    const interval = setInterval(() => {
      api.execute();
    }, intervalMs);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [api.execute, intervalMs]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    ...api,
    isPolling,
    startPolling,
    stopPolling,
  };
}

// Hook for multiple API calls
export function useApiBatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeBatch = useCallback(async <T>(
    requests: (() => Promise<T>)[]
  ): Promise<T[]> => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(requests.map(fn => fn()));
      setLoading(false);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch request failed';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    executeBatch,
  };
}