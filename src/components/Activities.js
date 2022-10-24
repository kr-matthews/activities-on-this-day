export default function Activities({
  month,
  day,
  earliestYear,
  activitiesData,
  activitiesIsLoading,
  activitiesError,
}) {
  // todo: check if 0 total activities
  return (
    <>
      <h1>
        Activities on {month} {day}
      </h1>
      <button
        onClick={() => {
          // ~
          console.debug(activitiesData);
          console.debug(activitiesError);
          console.debug(activitiesIsLoading);
        }}
      >
        Debug
      </button>
      {activitiesData.map(
        (activities, index) =>
          activities &&
          activities.length > 0 && (
            <ActivitiesOnOneDay
              key={earliestYear + index}
              year={earliestYear + index}
              activities={activities}
            />
          )
      )}
    </>
  );
}

// !! take in error and isLoading too
function ActivitiesOnOneDay({ year, activities = [] }) {
  return (
    <>
      <h2>{year}</h2>
      {activities.map((activity) => (
        <Activity key={activity.id} activity={activity} />
      ))}
    </>
  );
}

// todo: link to original activity
// NOTE: must follow Strava guidelines for linking back to original data
// see https://developers.strava.com/guidelines/#:~:text=3.%20Mandatory%20Linking%20to%20Strava%20Data
function Activity({ activity }) {
  return (
    <div>
      {activity.start_date_local} -- <b>{activity.name}</b>
    </div>
  );
}
