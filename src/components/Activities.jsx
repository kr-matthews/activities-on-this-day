import { useNavigate } from "react-router";

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
  preTitle,
}) {
  const navigate = useNavigate();

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

      {preTitle}

      <h1>
        Historical Activities from {month} {day}
      </h1>

      {areAllEmpty && (
        <p>
          {strings.sentences.noActivities}
          <button onClick={() => navigate("/sample")} style={{ margin: 10 }}>
            {strings.labels.sample}
          </button>
        </p>
      )}

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

// ! gracefully fade out if/when shouldShow goes to false
function ActivitiesOnOneDay({
  year,
  activities,
  isLoading = false,
  error = null,
  options = {},
}) {
  const shouldShow =
    (activities && activities.length > 0) || isLoading || error;

  const date = new Date();
  date.setFullYear(year);
  const dayOfWeek = date.toLocaleDateString("en-ca", { weekday: "long" });

  return (
    <>
      {shouldShow && (
        <>
          <h2>
            {year} ({dayOfWeek})
          </h2>
          <div className="activities-row">
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
          </div>
          {isLoading && <Loading task={`fetch ${year} activities`} />}
          {error && (
            <Error task={`fetch ${year} activities`} message={error.message} />
          )}
        </>
      )}
    </>
  );
}
