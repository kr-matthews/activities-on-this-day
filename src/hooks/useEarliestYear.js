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

  // !!! ref for below

  // const now = new Date();

  // return Array(latestYear - earliestYear + 1)
  //   .fill(0)
  //   .map((_, index) => {
  //     const historicalYear = latestYear - index;
  //     let historicalDay = new Date(now);
  //     historicalDay.setFullYear(historicalYear);
  //     const historicalSeconds = Math.floor(historicalDay.getTime() / 1000);
  //     const fortyEightHours = 48 * 60 * 60;
  //     const back48Hours = historicalSeconds - fortyEightHours;
  //     const forward48Hours = historicalSeconds + fortyEightHours;
  //   });

  //// Effects ////

  // test year incremented; check it
  useEffect(() => {
    function url(year) {
      const fortyEightHours = 48 * 60 * 60;
      const yearEnd = year + 1001 * fortyEightHours; // !!! wrong
      const forward48Hours = yearEnd + fortyEightHours;
      return `/.netlify/functions/get-activities?before=${forward48Hours}&access=${accessToken}`;
    }

    if (accessToken && isLoading) {
      console.debug("generic fetching year", testYear); // ~
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
      console.debug("no data year", testYear); // ~
      const latestYear = new Date().getFullYear() - 1;
      if (testYear === latestYear) {
        console.info("Found no activities, using year", latestYear);
        setIsLoading(false);
        setData(latestYear);
        setError(null);
        genericReset();
      } else {
        setTestYear((x) => x + 1);
      }
    }
  }, [genericData, data, testYear, genericReset]);

  // error
  useEffect(() => {
    if (genericError) {
      console.debug("error year"); // ~
      setIsLoading(false);
      setError(genericError);
    }
  }, [genericError, setError]);

  //// functions ////

  const fetch = useCallback(() => {
    console.debug("fetching year"); // ~
    // reset
    setIsLoading(true);
    setData(null);
    setError(null);
    genericReset();

    // trigger queries
    setTestYear(2008);
  }, [genericReset]);

  const reset = useCallback(() => {
    console.debug("resetting year"); // ~
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
