import Activity from "./Activity";
import Options from "./Options";
import Loading from "./Loading";
import Error from "./Error";

import useOptions from "../hooks/useOptions";
import strings from "../data/strings";

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

  const { options, optionSetters, resetAll } = useOptions();

  // todo: string resource with placeholder? h2 here, and year below
  return (
    <>
      <Options
        options={options}
        optionSetters={optionSetters}
        resetAll={resetAll}
      />

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
          options={options}
        />
      ))}
    </>
  );
}

// !: gracefully fade out if/when shouldShow goes to false
// !!! show day of the week
// !!! make activities appear in a row
function ActivitiesOnOneDay({
  year,
  activities,
  isLoading = false,
  error = null,
  options = {},
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
              <Activity
                key={activity.id}
                activity={activity}
                lineColour={options.lineColour}
                lineWeight={options.lineWeight}
                tileLayerName={options.tileLayerName}
              />
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
