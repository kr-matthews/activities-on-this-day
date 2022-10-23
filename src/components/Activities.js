// !! refactor to take in the data smoothly

export default function Activities({ month, day, activitiesPerYear = [] }) {
  // todo: check if 0 activities
  return (
    <>
      <h1>
        Activities on {month} {day}
      </h1>
      {activitiesPerYear.map(([year, activities]) => (
        <ActivitiesOnOneDay key={year} year={year} activities={activities} />
      ))}
    </>
  );
}

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
      {activity.name} at {activity.start_date_local}
    </div>
  );
}
