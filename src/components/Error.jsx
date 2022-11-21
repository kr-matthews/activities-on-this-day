import { useEffect } from "react";
import strings from "../data/strings";
import warning from "./../assets/warning.svg";

/*
 * From https://developers.strava.com/docs/#client-code
 * Here is a list of our common status codes:
 * - 200 Successful request
 * - 201 Your activity/etc. was successfully created
 * - 401 Unauthorized
 * - 403 Forbidden; you cannot access
 * - 404 Not found; the requested asset does not exist, or you are not authorized to see it
 * - 429 Too Many Requests; you have exceeded rate limits
 * - 500 Strava is having issues, please check https://status.strava.com
 */

export default function Error({ statusCode, customMessage, message }) {
  const displayTitle = statusCode ? "Strava Error" : "App Error";
  let stravaError = "";
  let explanation = "";
  switch (statusCode) {
    case 401:
      stravaError = strings.errors.strava401;
      explanation = strings.errors.unauthorized;
      break;

    case 403:
      stravaError = strings.errors.strava403;
      explanation = strings.errors.forbidden;
      break;

    case 404:
      stravaError = strings.errors.strava404;
      explanation = strings.errors.genericExplanation;
      break;

    case 429:
      stravaError = strings.errors.strava429;
      explanation = strings.errors.rateLimitExplanation;
      break;

    default:
      break;
  }

  useEffect(() => message && console.error(message), [message]);

  return (
    <div
      style={{
        border: "red solid",
        borderRadius: 15,
        background: "grey",
        color: "white",
        maxWidth: 600,
        margin: "auto",
        marginTop: 10,
        marginBottom: 10,
        display: "flex",
        padding: 10,
      }}
    >
      <div
        style={{ flex: 1, textAlign: "left", paddingLeft: 5, paddingRight: 15 }}
      >
        <img src={warning} alt="Warning" />
      </div>
      <div
        style={{
          flex: 5,
          textAlign: "left",
          marginTop: 3,
          marginBottom: 5,
          marginRight: 10,
        }}
      >
        <div style={{ fontSize: 25, marginBottom: 8 }}>{displayTitle}</div>
        {stravaError && <div style={{ marginBottom: 8 }}>"{stravaError}"</div>}
        {explanation && <div style={{ marginBottom: 8 }}>{explanation}</div>}
        {customMessage && <div>{customMessage}</div>}
      </div>
    </div>
  );
}
