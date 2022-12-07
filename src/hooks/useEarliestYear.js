import { useState, useEffect, useCallback } from "react";

import { useFetchData } from "./useFetchData";

export function useEarliestYear(accessToken) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [testYear, setTestYear] = useState(null);

  const {
    fetch: genericFetch,
    reset: genericReset,
    data: genericData,
    error: genericError,
  } = useFetchData();

  //// Effects ////

  // test year incremented; check it
  useEffect(() => {
    function url(year) {
      const yearEnd = new Date(year + 1, 0, 1);
      const yearEndInSeconds = Math.floor(yearEnd.getTime() / 1000);
      const fortyEightHours = 48 * 60 * 60;
      const forward48Hours = yearEndInSeconds + fortyEightHours;
      return `/.netlify/functions/get-activities?before=${forward48Hours}&access=${accessToken}`;
    }

    if (accessToken && isLoading) {
      genericFetch([url(testYear)]);
    }
  }, [testYear, accessToken, isLoading, genericFetch]);

  // test year has data; can stop
  useEffect(() => {
    if (genericData && genericData.length > 0) {
      // found a year with data
      console.info("Found first-ever activity in (or very near)", testYear);
      setIsLoading(false);
      setData(testYear);
      setError(null);
      genericReset();
    }
  }, [genericData, testYear, genericReset]);

  // test year has no data; increment it (unless at the end)
  useEffect(() => {
    if (genericData && genericData.length === 0 && !data) {
      const latestYear = new Date().getFullYear() - 1;
      if (testYear === latestYear) {
        console.info("Found no activities, using year", latestYear);
        setIsLoading(false);
        setData(latestYear);
        setError(null);
        genericReset();
      } else {
        genericReset();
        setTestYear((x) => x + 1);
      }
    }
  }, [genericData, data, testYear, genericReset]);

  // error
  useEffect(() => {
    if (genericError) {
      setIsLoading(false);
      setError(genericError);
    }
  }, [genericError, setError]);

  //// functions ////

  const fetch = useCallback(() => {
    // reset
    setIsLoading(true);
    setData(null);
    setError(null);
    genericReset();

    // trigger queries
    setTestYear(2008);
  }, [genericReset]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setData(null);
    setError(null);
  }, []);

  //// return ////

  return {
    fetch,
    reset,
    isLoading,
    data,
    error,
  };
}
