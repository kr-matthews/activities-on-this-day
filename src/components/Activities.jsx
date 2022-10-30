import Activity from "./Activity";
import Loading from "./Loading";
import Error from "./Error";

import strings from "../strings";

export default function Activities({
  year,
  month,
  day,
  activities = [],
  areLoading,
  errors,
}) {
  const areAllEmpty =
    activities.length > 0 &&
    activities.every((activities) => activities && activities.length === 0);

  // todo: string resource with placeholder? h2 here, and year below
  return (
    <>
      <h2>
        Historical Activities from {month} {day}
      </h2>

      {areAllEmpty && <div>{strings.sentences.noActivities}</div>}

      {activities.map((activitiesEntry, index) => (
        <ActivitiesOnOneDay
          key={year - index - 1}
          year={year - index - 1}
          activities={activitiesEntry}
          isLoading={areLoading[index]}
          error={errors[index]}
        />
      ))}
    </>
  );
}

// todo: gracefully fade out if/when shouldShow goes to false
// !!! activity layout/UI -- including map!
// !! show day of the week
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
          <h3>{year}</h3>
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
