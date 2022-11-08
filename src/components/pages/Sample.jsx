import { useNavigate } from "react-router-dom";

import Activities from "../Activities";
import Warning from "../Warning";

import { parseActivity } from "../../utils/activityUtils";
import strings from "../../data/strings";
import sampleActivities from "../../data/sampleActivities";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentDay = new Date().getDate();

export default function Sample() {
  const navigate = useNavigate();

  const activities = sampleActivities.map((activities) =>
    activities.map(parseActivity)
  );
  const len = activities.length;
  const areLoading = Array(len).fill(false);
  const errors = Array(len).fill(null);

  const warning = (
    <Warning
      label={strings.labels.note}
      sentence={strings.sentences.sampleWarning}
    >
      <div>
        <button onClick={() => navigate("/")}>{strings.labels.tryIt}</button>
      </div>
    </Warning>
  );

  return (
    <>
      <Activities
        year={currentYear}
        month={currentMonth}
        day={currentDay}
        activities={activities}
        areLoading={areLoading}
        errors={errors}
        preTitle={warning}
      />

      <div></div>
    </>
  );
}
