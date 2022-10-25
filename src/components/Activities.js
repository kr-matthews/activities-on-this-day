export default function Activities({
  year,
  month,
  day,
  activitiesData,
  // activitiesIsLoading,
  // activitiesError,
}) {
  // todo: check if 0 total activities
  return (
    <>
      <h1>
        Activities on {month} {day}
      </h1>
      {activitiesData.map(
        (activities, index) =>
          activities &&
          activities.length > 0 && (
            <ActivitiesOnOneDay
              key={year - index - 1}
              year={year - index - 1}
              activities={activities}
            />
          )
      )}
    </>
  );
}

// !!! add flags for dev

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
      {activity.startDateLocal} -- {activity.distanceInKm}km --{" "}
      <b>{activity.name}</b>
    </div>
  );
}
