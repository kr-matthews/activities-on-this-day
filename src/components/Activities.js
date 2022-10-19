export default function Activities({ month, day, activitiesPerYear = [] }) {
  return (
    <>
      <h1>
        Activities on {month} {day}"th"
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
function Activity({ activity }) {
  return (
    <div>
      {activity.name} at {activity.start_date_local}
    </div>
  );
}
