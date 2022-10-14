import axios from "axios";

import { useState } from "react";

export function useApiData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function getDataFromUrl(url) {
    setIsLoading(true);
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
  }

  return {
    getDataFromUrl,
    isLoading,
    data,
    error,
  };
}
