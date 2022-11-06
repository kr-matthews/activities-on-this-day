import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";

import strings from "../data/strings";
import tileLayers from "../data/tileLayers";
import {
  formatSeconds,
  formatMeters,
  formatMpsAsPace,
  formatMpsAsSpeed,
} from "../utils/displayUtils";

import commuteIconUrl from "../assets/briefcase.svg";
import lockIconUrl from "../assets/lock.svg";
import cameraIconUrl from "../assets/camera.svg";
import rideIconUrl from "../assets/bike.svg";
import runIconUrl from "../assets/runner.svg";
// import walkIconUrl from "../assets/walker.svg";
import walkIconUrl from "../assets/footprints.svg";
import hikeIconUrl from "../assets/hiker.svg";
import rulerIconUrl from "../assets/ruler.svg";
import timeIconUrl from "../assets/timer.svg";
import speedIconUrl from "../assets/speedometer.svg";

// NOTE: must follow Strava guidelines for linking back to original data
// see https://developers.strava.com/guidelines/#:~:text=3.%20Mandatory%20Linking%20to%20Strava%20Data
export default function Activity({
  activity: {
    id,
    name,
    type,
    distance,
    movingTime,
    elapsedTime,
    startDateLocal,
    polyline: activityPolyline,
    isCommute,
    isPrivate,
    averageSpeed,
    photoCount,
  },
  lineColour = "#603cba",
  lineWeight = 3,
  tileLayerName = "default",
  mapWidth = 300,
  mapHeight = 300,
}) {
  //// link ////

  const linkToActivity = `https://www.strava.com/activities/${id}`;

  //// activity path & map bounds ////

  // path

  const positions = polyline.decode(activityPolyline);

  // latitude

  const latMin = Math.min(
    Math.min(...positions.map((position) => position[0]))
  );
  const latMax = Math.max(
    Math.max(...positions.map((position) => position[0]))
  );

  // longitude

  const longMin = Math.min(
    Math.min(...positions.map((position) => position[1]))
  );
  const longMax = Math.max(
    Math.max(...positions.map((position) => position[1]))
  );

  // bounds

  const bounds = [
    [latMin, longMin],
    [latMax, longMax],
  ];

  //// tile layer ////

  const tileLayer = tileLayers[tileLayerName] || tileLayers.default;

  //// info ////

  const shouldDisplayPace = ["Run", "Walk", "Hike"].includes(type);
  const getActivityTypeIconUrl = (type) => {
    switch (type) {
      case "Run":
        return runIconUrl;
      case "Ride":
        return rideIconUrl;
      case "Walk":
        return walkIconUrl;
      case "Hike":
        return hikeIconUrl;
      default:
        // !!! 'other' type icon
        return "";
    }
  };

  const activityIcon = (
    <img className="icon" src={getActivityTypeIconUrl(type)} alt={`${type}`} />
  );
  const lockIcon = <img className="icon" src={lockIconUrl} alt="Private" />;
  const commuteIcon = (
    <img className="icon" src={commuteIconUrl} alt="Commute" />
  );
  const photoIcon = <img className="icon" src={cameraIconUrl} alt="Photos" />;

  const distanceIcon = <img className="icon" src={rulerIconUrl} alt="Photos" />;
  const timeIcon = <img className="icon" src={timeIconUrl} alt="Photos" />;
  const speedIcon = <img className="icon" src={speedIconUrl} alt="Photos" />;

  //// return ////

  // !! animate marker along path to show direction?
  return (
    <div className="activity">
      <div
        style={
          {
            // !!! style activity data
          }
        }
      >
        {activityIcon} <b>{name}</b> {isPrivate && lockIcon}{" "}
        {isCommute && commuteIcon} at {startDateLocal.substring(11, 16)}
      </div>

      <div>
        {distanceIcon}
        {formatMeters(distance)} {timeIcon}
        {formatSeconds(movingTime)} / {formatSeconds(elapsedTime)} {speedIcon}
        {shouldDisplayPace
          ? formatMpsAsPace(averageSpeed)
          : formatMpsAsSpeed(averageSpeed)}
      </div>

      <div style={{ width: mapWidth, margin: "auto", padding: 10 }}>
        <MapContainer
          style={{
            width: mapWidth,
            height: mapHeight,
            // just below the options header, which is set to 100
            zIndex: 99,
          }}
          // !! add button somewhere to re-center/zoom
          bounds={bounds}
          scrollWheelZoom
        >
          <TileLayer
            // key is required to force re-render when tile layer changes, since `url` is immutable
            key={tileLayerName}
            attribution={tileLayer.attribution}
            url={tileLayer.url}
          />
          <Polyline
            positions={positions}
            pathOptions={{ color: lineColour, weight: lineWeight }}
          />
        </MapContainer>
      </div>

      <a href={linkToActivity} target="_blank" rel="noopener noreferrer">
        {strings.labels.viewOnStrava} {photoCount > 0 && photoIcon}
      </a>
    </div>
  );
}
