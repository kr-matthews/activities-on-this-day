import buttonStravaConnect from "../../assets/button_strava_connect.svg";

// !! add app description, including revoke access note

export default function Authentication() {
  // todo: do cleaner url creation: extract base url into const or env, use builder (not just here)
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${window.location.origin}/redirect&approval_prompt=force&scope=activity:read_all`;

  // NOTE: must follow Strava guidelines for button UI and url base
  // see https://developers.strava.com/guidelines/#:~:text=1.1%20Connect%20with%20Strava%20buttons
  return (
    <>
      <p style={{ maxWidth: 600 }}>
        This is a simple app which displays your Strava activities that were
        recorded on this day in history. In order to see your activities, you'll
        need to provide permission for the app to access your Strava activities
        via the button below. Once granted, you can revoke this access at any
        time by going to your settings on Strava's website at{" "}
        <a
          href="https://www.strava.com/settings/apps"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.strava.com/settings/apps
        </a>
        . There will also be a link at the bottom of this page.
      </p>
      <a href={authUrl}>
        <img src={buttonStravaConnect} alt="Connect with Strava" />
      </a>
    </>
  );
}
