import { useNavigate } from "react-router";

import Warning from "../Warning";

import strings from "../../data/strings";
import buttonStravaConnect from "../../assets/button_strava_connect.svg";

export default function Authentication({ hasRefreshToken }) {
  // ! redirect to mobile app when on phone??
  // todo: do cleaner url creation: extract base url into const or env, use builder (not just here)
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${window.location.origin}/redirect&approval_prompt=force&scope=activity:read_all`;

  const navigate = useNavigate();

  // NOTE: must follow Strava guidelines for button UI and url base
  // see https://developers.strava.com/guidelines/#:~:text=1.1%20Connect%20with%20Strava%20buttons
  return (
    <div>
      <h1>{strings.headings.appName}</h1>

      {hasRefreshToken && (
        <Warning
          label={strings.labels.note}
          sentence={strings.sentences.alreadyAuthenticated}
        >
          <div>
            <button onClick={() => navigate("/")}>
              {strings.labels.activities}
            </button>
          </div>
        </Warning>
      )}

      <div className="rectangle">
        {strings.sentences.description}
        <div>
          <a href={authUrl}>
            <img src={buttonStravaConnect} alt="Connect with Strava" />
          </a>
        </div>
      </div>

      <div className="rectangle">
        {strings.sentences.sample}
        <div>
          <button onClick={() => navigate("/sample")}>
            {strings.labels.sample}
          </button>
        </div>
      </div>
    </div>
  );
}
