import { useCallback, useMemo } from "react";

import { useFetchData } from "./useFetchData";

// todo: make date override-able (but not obvious that you can)

export function useFetchActivities(earliestYear, accessToken) {
  const {
    isEachLoading,
    eachData,
    eachError,
    fetch: genericFetch,
    reset: genericReset,
  } = useFetchData();

  const lastYear = new Date().getFullYear() - 1;

  const urls = useMemo(() => {
    const now = new Date();

    return Array(lastYear - earliestYear + 1)
      .fill(0)
      .map((_, index) => {
        const historicalYear = earliestYear + index;
        let historicalDay = new Date(now);
        historicalDay.setFullYear(historicalYear);
        const historicalSeconds = Math.floor(historicalDay.getTime() / 1000);
        const fortyEightHours = 48 * 60 * 60;
        const back48Hours = historicalSeconds - fortyEightHours;
        const forward48Hours = historicalSeconds + fortyEightHours;

        return `/.netlify/functions/get-activities?before=${forward48Hours}&after=${back48Hours}&access=${accessToken}`;
      });
  }, [earliestYear, lastYear, accessToken]);

  const fetch = useCallback(() => {
    genericFetch(urls);
  }, [genericFetch, urls]);

  return {
    fetch,
    reset: genericReset,

    isEachLoading,
    eachData,
    eachError,
  };
}
