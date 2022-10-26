import Loading from "./Loading";
import Error from "./Error";

export default function Activities({
  year,
  month,
  day,
  activitiesData,
  activitiesIsLoading,
  activitiesError,
}) {
  const areAllEmpty =
    activitiesData.length > 0 &&
    activitiesData.every((activities) => activities && activities.length === 0);

  return (
    <>
      <h2>
        Historical Activities from {month} {day}
      </h2>

      {areAllEmpty && (
        <div>You don't have any activities on this day in history.</div>
      )}
      {activitiesData.map((activities, index) => (
        <ActivitiesOnOneDay
          key={year - index - 1}
          year={year - index - 1}
          activities={activities}
          isLoading={activitiesIsLoading[index]}
          error={activitiesError[index]}
        />
      ))}
    </>
  );
}

// todo: gracefully fade out if/when shouldShow goes to false
// ! activity layout/UI -- including map!
function ActivitiesOnOneDay({
  year,
  activities,
  isLoading = false,
  error = null,
}) {
  const shouldShow =
    (activities && activities.length > 0) || isLoading || error;
  return (
    <>
      {shouldShow && (
        <>
          <h2>{year}</h2>
          {activities &&
            activities.map((activity) => (
              <Activity key={activity.id} activity={activity} />
            ))}
          {isLoading && <Loading task={`fetch ${year} activities`} />}
          {error && (
            <Error task={`fetch ${year} activities`} message={error.message} />
          )}
        </>
      )}
    </>
  );
}

// NOTE: must follow Strava guidelines for linking back to original data
// see https://developers.strava.com/guidelines/#:~:text=3.%20Mandatory%20Linking%20to%20Strava%20Data
function Activity({ activity }) {
  const linkToActivity = `https://www.strava.com/activities/${activity.id}`;
  return (
    <>
      <div>
        {activity.startDateLocal} -- {activity.type} {activity.distanceInKm}km
        -- <b>{activity.name}</b>
      </div>
      <a href={linkToActivity} target="_blank" rel="noopener noreferrer">
        View on Strava
      </a>
    </>
  );
}
