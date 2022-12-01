import { useState, useEffect } from "react";
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

  const allActivities = sampleActivities.map((activities) =>
    activities.map(parseActivity)
  );
  const [activities, setActivities] = useState(allActivities.map(() => null));
  const len = activities.length;
  const [areLoading, setAreLoading] = useState(Array(len).fill(true));
  const errors = Array(len).fill(null);

  // simulate loading activities, even though they're immediately accessible
  useEffect(() => {
    for (let i = 0; i < len; i++) {
      setTimeout(() => {
        setAreLoading((arr) => {
          const newArr = arr.slice();
          newArr[i] = false;
          return newArr;
        });
        setActivities((act) => {
          const newAct = act.slice();
          newAct[i] = allActivities[i];
          return newAct;
        });
        // random response time per year, between .5 and 2.5 seconds
      }, 500 + Math.random() * 2000);
    }
  }, [len, allActivities]);

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
