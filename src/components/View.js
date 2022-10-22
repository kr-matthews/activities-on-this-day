import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Activities from "./Activities";
import Loading from "./Loading";
import Error from "./Error";

import { useFetchData } from "../hooks/useFetchData";
import { useSavedState } from "../hooks/useSavedState";

export default function View({ refreshToken }) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useSavedState("access", null);
  const [accessExpiration, setAccessExpiration] = useSavedState(
    "expiration",
    null
  );
  const canUseAccessToken = !isExpiredOrExpiringSoon(accessExpiration);
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
      navigate("/authenticate");
    }
  });

  useEffect(() => {
    if (!canUseAccessToken) {
      setAccessToken(null);
      setAccessExpiration(null);
    }
  }, [canUseAccessToken, setAccessToken, setAccessExpiration]);

  useEffect(() => {
    if (refreshToken && !accessToken) {
      // !! fetch access token via refresh token, via getAccessToken
    }
  }, [refreshToken, accessToken]);

  useEffect(() => {
    if (accessTokenData) {
      setAccessToken(accessTokenData);
      // !! also return expiration, and set that properly
      setAccessExpiration(1);
    }
  });

  useEffect(() => {
    if (accessToken && canUseAccessToken && !haveFetchedActivities) {
      // !! fetch activities via access token, set them
      //   activityData.fetch(
      //     `/.netlify/functions/activities?refresh=${refreshToken}`
      //   );
    }
  }, [accessToken, canUseAccessToken]);

  // ! handle activities, activity loading and errors
  return (
    <>
      <div>
        <button
          onClick={() => {
            navigate("/authenticate");
          }}
        >
          Restart
        </button>
      </div>
      {isAccessTokenLoading && <Loading task="fetch activities" />}
      <Activities
        month="January"
        day={0}
        activitiesPerYear={[
          [2019, []],
          [2021, []],
        ]}
      />
      {accessTokenError && (
        <Error task="fetch activities" message={accessTokenError.message} />
      )}
    </>
  );
}

function isExpiredOrExpiringSoon(expiration) {
  // !! check expiration
  return false;
}
