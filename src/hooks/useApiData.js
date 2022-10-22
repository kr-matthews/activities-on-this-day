import axios from "axios";

import { useCallback, useState } from "react";

// ! refactor to accept/return arrays of url/data
// todo: rename to fetchData

export function useApiData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const getDataFromUrl = useCallback(
    async (url) => {
      setIsLoading(true);
      setData(null);
      setError(null);
      try {
        const result = await axios.get(url);
        console.info(result);
        setData(result.data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError(e);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setData, setError]
  );

  function reset() {
    setIsLoading(false);
    setData(null);
    setError(null);
  }

  return {
    getDataFromUrl,
    reset,
    isLoading,
    data,
    error,
  };
}
