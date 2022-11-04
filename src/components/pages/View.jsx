import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Activities from "../Activities";
import Loading from "../Loading";
import Error from "../Error";

import { useSavedState } from "../../hooks/useSavedState";
import useActivities from "../../hooks/useActivities";
import strings from "../../data/strings";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentDay = new Date().getDate();

export default function View({ refreshToken }) {
  const navigate = useNavigate();

  // todo: allow setting earliest year; ensure it stays between 2008 and last year (use reducer?)
  const [earliestYear, setEarliestYear] = useSavedState("year", 2008);

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
    clearActivities,
    setLastFetchedToYesterday,
  } = useActivities(refreshToken, earliestYear);

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

      {accessTokenError && (
        <Error task="fetch access token" message={accessTokenError.message} />
      )}

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
            <button onClick={() => setEarliestYear(2020)}>
              2020 -{">"} Earliest
            </button>
            <button onClick={() => setEarliestYear(2014)}>
              2014 -{">"} Earliest
            </button>
          </div>
        </>
      )}

      <p>
        <a
          href={strings.links.revokeAccess}
          target="_blank"
          rel="noopener noreferrer"
        >
          {strings.labels.revokeAccess}
        </a>
      </p>
    </>
  );
}
