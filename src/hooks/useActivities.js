import { useCallback, useEffect } from "react";

import { useSavedState } from "./useSavedState";
import { useFetchData } from "./useFetchData";
import { useEarliestYear } from "./useEarliestYear";
import { useFetchActivities } from "./useFetchActivities";

export default function useActivities(refreshToken) {
  //// access token ////

  const [accessToken, setAccessToken] = useSavedState("access", null);
  const [accessExpiration, setAccessExpiration] = useSavedState(
    "expiration",
    null
  );

  const canUseAccessToken =
    accessToken && !isExpiredOrExpiringSoon(accessExpiration);

  const {
    data: receivedAccessTokenData,
    isLoading: accessTokenIsLoading,
    error: accessTokenError,
    fetch,
    reset: resetAccessTokenFetch,
  } = useFetchData();

  const fetchAccessToken = useCallback(() => {
    if (refreshToken) {
      fetch([`/.netlify/functions/get-access-token?refresh=${refreshToken}`]);
    } else {
      console.warn(
        "Tried to fetch access token but didn't have a refresh token."
      );
    }
  }, [refreshToken, fetch]);

  //// earliest year ////

  const [earliestYear, setEarliestYear] = useSavedState("earliest", null);
  const {
    data: yearData,
    isLoading: yearIsLoading,
    error: yearError,
    fetch: yearFetch,
  } = useEarliestYear(accessToken);

  //// activities ////

  const [activities, setActivities] = useSavedState("activities", []);
  const [errors, setErrors] = useSavedState("errors", []);
  // note: saved as date string, not absolute ms, since local day is important
  const [lastFetchedActivities, setLastFetchedActivities] = useSavedState(
    "fetched",
    null
  );

  const hasFetchedActivitiesToday =
    lastFetchedActivities === new Date().toDateString();

  const {
    eachData: receivedActivities,
    isEachLoading: activitiesAreLoading,
    eachError: activitiesErrors,
    fetch: fetchActivities,
    reset: resetActivitiesFetch,
  } = useFetchActivities(earliestYear, accessToken);

  const areAllActivitiesDoneLoading = activitiesAreLoading.every((x) => !x);

  //// effects ////

  // fetch a new access token if it's expired (or non-existent) and we haven't already fetched activities today
  useEffect(() => {
    if (!canUseAccessToken && !hasFetchedActivitiesToday) {
      console.info("Fetching access token.");
      setActivities([]);
      setErrors([]);
      fetchAccessToken();
    }
  }, [
    canUseAccessToken,
    hasFetchedActivitiesToday,
    setActivities,
    setErrors,
    fetchAccessToken,
  ]);

  // save the access token when it's received
  useEffect(() => {
    if (receivedAccessTokenData) {
      console.info("Received access token; saving it.");
      setAccessToken(receivedAccessTokenData.access_token);
      setAccessExpiration(receivedAccessTokenData.expires_at * 1000);
      resetAccessTokenFetch();
    }
  }, [
    receivedAccessTokenData,
    setAccessExpiration,
    setAccessToken,
    resetAccessTokenFetch,
  ]);

  // if earliest year hasn't ever been figured out, find it
  useEffect(() => {
    if (canUseAccessToken && !earliestYear) {
      console.info("Querying first-ever activity.");
      yearFetch();
    }
  }, [canUseAccessToken, earliestYear, yearFetch]);

  // figured out earliest year
  useEffect(() => {
    if (yearData) {
      setEarliestYear(yearData);
    }
  }, [yearData, setEarliestYear]);

  // fetch activities if we haven't already today (and there's an access token available and we know how far back to go)
  useEffect(() => {
    if (canUseAccessToken && !hasFetchedActivitiesToday && earliestYear) {
      setActivities([]);
      setErrors([]);
      console.info("Fetching activities.");
      fetchActivities();
      setLastFetchedActivities(new Date().toDateString());
    }
  }, [
    accessToken,
    canUseAccessToken,
    earliestYear,
    hasFetchedActivitiesToday,
    setActivities,
    setErrors,
    fetchActivities,
    setLastFetchedActivities,
  ]);

  // save the activities (and errors) when they're _all_ received
  useEffect(() => {
    if (areAllActivitiesDoneLoading && receivedActivities.length > 0) {
      console.info("Received activities; saving them.");
      setActivities(receivedActivities);
      setErrors(activitiesErrors);
      resetActivitiesFetch();
    }
  }, [
    areAllActivitiesDoneLoading,
    receivedActivities,
    activitiesErrors,
    setActivities,
    setErrors,
    resetActivitiesFetch,
  ]);

  //// functions ////

  function clearActivities() {
    // this will trigger clearing and fetching activities/errors (and access token first if necessary)
    setLastFetchedActivities(null);
  }

  function setLastFetchedToYesterday() {
    setLastFetchedActivities(
      new Date(new Date().getTime() - 86400000).toDateString()
    );
  }

  //// return ////

  return {
    // access token
    accessTokenIsLoading,
    accessTokenError,

    // earliest year
    yearIsLoading,
    yearError,

    // activities
    // the fetched activities/errors are valid if not [], else fallback to saved
    activities: receivedActivities.length > 0 ? receivedActivities : activities,
    activitiesAreLoading,
    errors: activitiesErrors.length > 0 ? activitiesErrors : errors,

    // debug
    clearActivities,
    setLastFetchedToYesterday,
  };
}

//// helpers ////

function isExpiredOrExpiringSoon(expiration) {
  const currentSeconds = () => new Date().getTime();
  const tenMinutes = 10 * 60 * 1000;
  return expiration - tenMinutes < currentSeconds();
}
