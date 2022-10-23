import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Activities from "./Activities";
import Loading from "./Loading";
import Error from "./Error";

import { useFetchData } from "../hooks/useFetchData";
import { useSavedState } from "../hooks/useSavedState";

const currentTime = () => new Date().getTime() / 1000;

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

  const {
    data: accessTokenData,
    isLoading: isAccessTokenLoading,
    error: accessTokenError,
    fetch: fetchAccessToken,
  } = useFetchData();
  const {
    eachData: activitiesData,
    eachIsLoading: activitiesIsLoading,
    eachError: activitiesError,
    fetch: fetchActivities,
  } = useFetchData();
  const haveFetchedActivities = activitiesData.length > 0;

  useEffect(() => {
    if (!refreshToken) {
      console.error("No refresh token.");
      navigate("/authenticate");
    }
  });

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
    }
  });

  useEffect(() => {
    if (accessToken && canUseAccessToken && !haveFetchedActivities) {
      console.info("Fetching activities.");
      // !!! fetch activities PER YEAR
      //   fetchActivities(
      //     `/.netlify/functions/get-activities?access=${accessToken}`
      //   );
    }
  }, [accessToken, canUseAccessToken, haveFetchedActivities]);

  // !! pass in activities, loading, and errors
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
        activitiesPerYear={[
          [2019, []],
          [2021, []],
        ]}
      />
      {accessTokenError && (
        <Error task="fetch access token" message={accessTokenError.message} />
      )}
    </>
  );
}

// everything in seconds
function isExpiredOrExpiringSoon(expiration) {
  const tenMinutes = 10 * 60;
  return expiration - tenMinutes < currentTime();
}
