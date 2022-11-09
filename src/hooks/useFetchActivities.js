import { useCallback, useMemo } from "react";

import { useFetchData } from "./useFetchData";
import { parseActivity } from "../utils/activityUtils";

// todo: make date override-able (but not obvious that you can)

export function useFetchActivities(earliestYear, accessToken) {
  const {
    isEachLoading,
    eachData: unprocessedData,
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
        const historicalYear = lastYear - index;
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

  const processedData = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const monthString = month < 9 ? `0${month + 1}` : `${month + 1}`;
    const day = now.getDate();
    const dayString = day < 10 ? `0${day}` : `${day}`;
    const dateToMatch = `${monthString}-${dayString}`;

    return unprocessedData.map(
      (activities) =>
        activities &&
        activities
          .filter(
            (activity) =>
              activity.start_date_local.substring(5, 10) === dateToMatch
          )
          .map(parseActivity)
          // reverse to get chronological order within the year
          .reverse()
    );
  }, [unprocessedData]);

  return {
    fetch,
    reset: genericReset,

    isEachLoading,
    eachData: processedData,
    eachError,
  };
}
