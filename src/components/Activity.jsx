import strings from "../strings";

// NOTE: must follow Strava guidelines for linking back to original data
// see https://developers.strava.com/guidelines/#:~:text=3.%20Mandatory%20Linking%20to%20Strava%20Data
export default function Activity({
  activity: { id, type, name, distanceInKm, startDateLocal },
}) {
  const linkToActivity = `https://www.strava.com/activities/${id}`;
  return (
    <>
      <div>
        {startDateLocal} -- {type} {distanceInKm}km -- <b>{name}</b>
      </div>
      <a href={linkToActivity} target="_blank" rel="noopener noreferrer">
        {strings.labels.viewOnStrava}
      </a>
    </>
  );
}
