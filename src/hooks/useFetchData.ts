import { useState, useEffect, useCallback, useRef } from "react";

export const useFetchData = <T>(url: string, options: RequestInit = {}) => {
  const [data, setData] = useState<null | T>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(true);

  const optionsRef = useRef(options);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(url, optionsRef.current);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as T;

      setData(result);
    } catch (err) {
      setError((err as { message: string })?.message || "Failed to fetch data!");
    } finally {
      setIsLoading(false);
    }
  }, [url, optionsRef]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch };
};
