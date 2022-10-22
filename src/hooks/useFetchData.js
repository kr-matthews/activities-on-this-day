import axios from "axios";

import { useCallback, useState } from "react";

export function useFetchData() {
  const [isEachLoading, setIsEachLoading] = useState([]);
  const [eachData, setEachData] = useState([]);
  const [eachError, setEachError] = useState([]);

  const fetch = useCallback(
    async (urls) => {
      const amount = urls.length;
      setIsEachLoading(Array(amount).fill(true));
      setEachData(Array(amount).fill(null));
      setEachError(Array(amount).fill(null));
      urls.forEach((url, index) => {
        const fetchOne = async () => {
          try {
            const result = await axios.get(url);
            // todo: use reducer for data
            const newData = [...eachData];
            newData[index] = result.data;
            setEachData(newData);
          } catch (e) {
            console.error(index, e);
            // todo: use reducer for error
            const newError = [...eachError];
            newError[index] = e;
            setEachError(newError);
          } finally {
            // todo: use reducer for isLoading
            const newIsLoading = [...isEachLoading];
            newIsLoading[index] = false;
            setIsEachLoading(newIsLoading);
          }
        };
        fetchOne();
      });
    },
    [setIsEachLoading, setEachData, setEachError]
  );

  function reset() {
    setIsEachLoading([]);
    setEachData([]);
    setEachError([]);
  }

  return {
    fetch,
    reset,

    isEachLoading,
    eachData,
    eachError,

    isLoading: isEachLoading[0],
    data: eachData[0],
    error: eachError[0],
  };
}
