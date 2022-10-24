import buttonStravaConnect from "../assets/button_strava_connect.svg";

export default function Authentication() {
  // ! do cleaner url creation: extract base url into const or env, use builder (not just here)
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${window.location.origin}/redirect&approval_prompt=force&scope=activity:read_all`;

  // NOTE: must follow Strava guidelines for button UI and url base
  // see https://developers.strava.com/guidelines/#:~:text=1.1%20Connect%20with%20Strava%20buttons
  return (
    <a href={authUrl}>
      <img src={buttonStravaConnect} alt="Connect with Strava" />
    </a>
  );
}
