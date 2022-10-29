import { useCallback, useEffect } from "react";

import { useSavedState } from "./useSavedState";
import { useFetchData } from "./useFetchData";
import { useFetchActivities } from "./useFetchActivities";

export default function useActivities(refreshToken, earliestYear = 2008) {
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

  //// activities ////

  const [activities, setActivities] = useSavedState("activities", []);
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
      fetchAccessToken();
    }
  }, [
    canUseAccessToken,
    hasFetchedActivitiesToday,
    setActivities,
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

  // fetch activities if we haven't already today and there's an access token available
  useEffect(() => {
    if (canUseAccessToken && !hasFetchedActivitiesToday) {
      setActivities([]);
      console.info("Fetching activities.");
      fetchActivities();
      setLastFetchedActivities(new Date().toDateString());
    }
  }, [
    accessToken,
    canUseAccessToken,
    hasFetchedActivitiesToday,
    setActivities,
    fetchActivities,
    setLastFetchedActivities,
  ]);

  // save the activities when they're _all_ received
  useEffect(() => {
    if (areAllActivitiesDoneLoading && receivedActivities.length > 0) {
      console.info("Received activities from Strava; saving them.");
      setActivities(receivedActivities);
      resetActivitiesFetch();
      // !!! also save errors?
    }
  }, [
    areAllActivitiesDoneLoading,
    receivedActivities,
    setActivities,
    resetActivitiesFetch,
  ]);

  //// functions ////

  function resetActivities() {
    // this will trigger clearing and fetching activities (and access token first if necessary)
    setLastFetchedActivities(null);
  }

  //// return ////

  return {
    // access token
    accessTokenIsLoading,
    accessTokenError,

    // activities
    activities,
    activitiesAreLoading,
    activitiesErrors,

    // clear
    resetActivities,
  };
}

//// helpers ////

function isExpiredOrExpiringSoon(expiration) {
  const currentSeconds = () => new Date().getTime();
  const tenMinutes = 10 * 60 * 1000;
  return expiration - tenMinutes < currentSeconds();
}
