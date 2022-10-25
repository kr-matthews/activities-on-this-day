import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Activities from "./Activities";
import Loading from "./Loading";
import Error from "./Error";

import { useSavedState } from "../hooks/useSavedState";
import { useFetchData } from "../hooks/useFetchData";
import { useFetchActivities } from "../hooks/useFetchActivities";

// todo: clean up time utils, be consistent with s vs ms

const fiveMinutes = 5 * 60 * 1000;
const currentSeconds = () => new Date().getTime() / 1000;

export default function View({ refreshToken }) {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useSavedState("access", null);
  const [accessExpiration, setAccessExpiration] = useSavedState(
    "expiration",
    null
  );
  const hasAccessToken = !!accessToken;
  const canUseAccessToken =
    hasAccessToken && !isExpiredOrExpiringSoon(accessExpiration);

  const [earliestYear] = useSavedState("year", 2014); // ~ use 2008 // ~ [..., setEarliestYear]

  const {
    data: accessTokenData,
    isLoading: isAccessTokenLoading,
    error: accessTokenError,
    fetch: fetchAccessToken,
    reset: resetAccessTokenFetch,
  } = useFetchData();
  const {
    eachData: activitiesData,
    eachIsLoading: activitiesIsLoading,
    eachError: activitiesError,
    fetch: fetchActivities,
  } = useFetchActivities(earliestYear, accessToken);
  const [lastFetchedActivities, setLastFetchedActivities] = useSavedState(
    "fetched",
    null
  );
  const hasFetchedWithinFiveMinutes =
    new Date().getTime() - lastFetchedActivities <= fiveMinutes;

  useEffect(() => {
    if (!refreshToken) {
      console.error("No refresh token.");
      navigate("/authenticate");
    }
  }, [refreshToken, navigate]);

  useEffect(() => {
    if (!canUseAccessToken) {
      console.info("Access token expired, expiring too soon, or non-existent.");
      setAccessToken(null);
      setAccessExpiration(null);
    }
  }, [canUseAccessToken, setAccessToken, setAccessExpiration]);

  useEffect(() => {
    if (refreshToken && !accessToken) {
      console.info("Fetching access token.");
      fetchAccessToken([
        `/.netlify/functions/get-access-token?refresh=${refreshToken}`,
      ]);
    }
  }, [refreshToken, accessToken, fetchAccessToken]);

  useEffect(() => {
    if (accessTokenData) {
      console.info("Received access token.");
      setAccessToken(accessTokenData.access_token);
      setAccessExpiration(accessTokenData.expires_at);
      resetAccessTokenFetch();
    }
  }, [accessTokenData, setAccessExpiration, setAccessToken]);

  useEffect(() => {
    if (accessToken && canUseAccessToken && !hasFetchedWithinFiveMinutes) {
      console.info("Fetching activities.");
      fetchActivities();
      setLastFetchedActivities(new Date().getTime());
    }
  }, [
    accessToken,
    canUseAccessToken,
    hasFetchedWithinFiveMinutes,
    fetchActivities,
    setLastFetchedActivities,
  ]);

  return (
    <>
      <div>
        <button
          onClick={() => {
            setAccessToken(null);
            setAccessExpiration(null);
            navigate("/authenticate");
          }}
        >
          Clear access token
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/authenticate");
          }}
        >
          Restart
        </button>
      </div>
      {isAccessTokenLoading && <Loading task="fetch access token" />}
      <Activities
        month="January"
        day={0}
        earliestYear={earliestYear}
        activitiesData={activitiesData}
        activitiesIsLoading={activitiesIsLoading}
        activitiesError={activitiesError}
      />
      {hasFetchedWithinFiveMinutes && activitiesData.length === 0 && (
        <button
          onClick={() => {
            fetchActivities();
            setLastFetchedActivities(new Date().getTime());
          }}
        >
          Fetch Activities
        </button>
      )}
      {accessTokenError && (
        <Error task="fetch access token" message={accessTokenError.message} />
      )}
    </>
  );
}

// everything in seconds
function isExpiredOrExpiringSoon(expiration) {
  const tenMinutes = 10 * 60;
  return expiration - tenMinutes < currentSeconds();
}
