import { useApiData } from "./useApiData";

import { useEffect } from "react";
import { useSavedState } from "./useSavedState";

import buttonStravaConnect from "./button_strava_connect.svg";
import logoPoweredByStrava from "./logo_powered_by_strava.svg";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const codeFromUrl = params.get("code");
  const errorFromUrl = params.get("error");

  const [authCode, setAuthCode] = useSavedState("code", null);
  const [error, setError] = useSavedState("error", null);
  const [refreshToken, setRefreshToken] = useSavedState("refreshToken", null);

  const apiData = useApiData();
  const activityData = useApiData();

  function fetchRefresh() {
    apiData.getDataFromUrl(`/.netlify/functions/auth?code=${authCode}`);
  }

  function fetchActivities() {
    activityData.getDataFromUrl(
      `/.netlify/functions/activities?refresh=${refreshToken}`
    );
  }

  useEffect(() => {
    if (codeFromUrl) {
      setAuthCode(codeFromUrl);
      setError(null);
      window.location = window.location.origin;
    }
  }, [codeFromUrl, setAuthCode, setError]);

  useEffect(() => {
    if (errorFromUrl) {
      setAuthCode(null);
      setError(errorFromUrl);
      window.location = window.location.origin;
    }
  }, [errorFromUrl, setAuthCode, setError]);

  useEffect(() => {
    if (apiData.data) {
      setRefreshToken(apiData.data);
    }
  }, [apiData.data, setRefreshToken]);

  return (
    <>
      <h1>Activities On-This-Day [WIP]</h1>
      <div>
        <button
          onClick={() => {
            setAuthCode(null);
            setError(null);
            setRefreshToken(null);
            apiData.reset();
            activityData.reset();
          }}
        >
          Reset All
        </button>
      </div>

      <h2>Auth code</h2>
      <a
        href={`https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${window.location.origin}&approval_prompt=force&scope=activity:read_all`}
      >
        <img src={buttonStravaConnect} alt="Connect with Strava" />
      </a>
      {authCode && <p>Your code is {authCode}.</p>}
      {error && <p>Error: {error}.</p>}

      <h2>Refresh token</h2>
      {authCode && <button onClick={fetchRefresh}>Fetch</button>}
      {apiData.isLoading && <p>Loading...</p>}
      {refreshToken && <p>Refresh token is {refreshToken}.</p>}
      {apiData.error && <p>Error: {apiData.error.message}</p>}

      <h2>Activities</h2>
      {refreshToken && <button onClick={fetchActivities}>Fetch</button>}
      {activityData.isLoading && <p>Loading Activities</p>}
      {activityData.data && <p>Activity count: {activityData.data.length}</p>}
      {activityData.error && (
        <p>Activity Loading Error: {activityData.error.message}</p>
      )}

      <div>
        <img
          src={logoPoweredByStrava}
          style={{ width: 200 }}
          alt="Powered by Strava"
        />
      </div>
    </>
  );
}
