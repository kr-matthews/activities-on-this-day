import { useNavigate } from "react-router";

import Activity from "./Activity";
import Options from "./Options";
import Loading from "./Loading";
import Error from "./Error";

import useOptions from "../hooks/useOptions";
import strings from "../data/strings";

import "./activities.css";

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

  // todo: TIDY - string resource with placeholder? h2 here, and year below
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
        <div className="rectangle">
          {strings.sentences.noActivities}
          <div>
            <button onClick={() => navigate("/sample")}>
              {strings.labels.sample}
            </button>
          </div>
        </div>
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

      {!areAllEmpty && <p>{strings.sentences.animationDisclaimer}</p>}
    </>
  );
}

function ActivitiesOnOneDay({
  year,
  activities,
  isLoading = false,
  error = null,
  options = {},
}) {
  const shouldShow = !!(
    (activities && activities.length > 0) ||
    isLoading ||
    error
  );

  const date = new Date();
  date.setFullYear(year);
  const dayOfWeek = date.toLocaleDateString("en-ca", { weekday: "long" });

  // awkward hard-coded heights since can't transition between auto heights
  // doesn't work when zoomed out significantly
  // todo: UI - find a better solution to height transitions
  // note height is larger on mobile
  const totalHeight = 650;
  const titleAndErrorHeight = 250;
  const titleAndLoadingHeight = 110;
  const zeroHeight = 0;
  const height = shouldShow
    ? isLoading
      ? titleAndLoadingHeight
      : error
      ? titleAndErrorHeight
      : totalHeight
    : zeroHeight;

  return (
    <div
      className="height-transition"
      style={{
        overflow: "hidden",
        maxHeight: height,
      }}
    >
      <h2>
        {year} ({dayOfWeek})
      </h2>

      {isLoading && <Loading task={`fetch ${year} activities`} />}

      {shouldShow || <div style={{ minHeight: 40 }}></div>}

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

      {error && (
        <Error
          statusCode={
            error.statusCode || error.response?.status || error.status
          }
          message={error.message}
        />
      )}
    </div>
  );
}
