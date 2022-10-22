import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Activities from "./Activities";
import Loading from "./Loading";
import Error from "./Error";

import { useApiData } from "../hooks/useApiData";
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
    getDataFromUrl: getAccessToken,
  } = useApiData();
  // !! get activities hook
  const activityDataApi = useApiData();

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
    // !! false <- are there activities already
    if (accessToken && canUseAccessToken && !false) {
      // !! fetch activities via access token, set them
    }
  }, [accessToken, canUseAccessToken]);

  useEffect(() => {
    // todo: handle successful fetch of activities
  });

  // function oldFunction() {
  //   activityData.getDataFromUrl(
  //     `/.netlify/functions/activities?refresh=${refreshToken}`
  //   );
  // }

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
