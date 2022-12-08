import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Activities from "../Activities";
import Loading from "../Loading";
import Error from "../Error";
import RevokeAndClear from "../RevokeAndClear";

import useActivities from "../../hooks/useActivities";
import strings from "../../data/strings";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentDay = new Date().getDate();

export default function View({ refreshToken, clearRefreshToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!refreshToken) {
      console.error("No refresh token.");
      navigate("/authenticate");
    }
  }, [refreshToken, navigate]);

  const {
    activities,
    activitiesAreLoading,
    errors,
    accessTokenIsLoading,
    accessTokenError,
    yearIsLoading,
    yearError,
    clearActivities,
    setLastFetchedToYesterday,
  } = useActivities(refreshToken);
  const error = accessTokenError || yearError;

  const showDevOptions = process.env.REACT_APP_ENV === "LOCAL";

  return (
    <>
      <Activities
        year={currentYear}
        month={currentMonth}
        day={currentDay}
        activities={activities}
        areLoading={activitiesAreLoading}
        errors={errors}
      />

      {accessTokenIsLoading && <Loading task="fetch access token" />}
      {yearIsLoading && <Loading task="query year of earliest activity" />}

      {error && (
        <Error
          statusCode={
            error.statusCode || error.response?.status || error.status
          }
          message={error.message}
        />
      )}

      <RevokeAndClear clearRefreshToken={clearRefreshToken} />

      {showDevOptions && (
        <>
          <div>
            <button onClick={() => navigate("/authenticate")}>
              {strings.dev.goToAuth}
            </button>
            <button onClick={clearActivities}>
              {strings.dev.clearActivities}
            </button>
            <button onClick={setLastFetchedToYesterday}>
              {strings.dev.setToYesterday}
            </button>
          </div>
        </>
      )}
    </>
  );
}
