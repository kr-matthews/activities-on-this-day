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

  // !!! get actual icons; per type, lock, photo, briefcase(?)
  const displayPace = ["Run", "Trail Run", "Walk", "Hike"].includes(type);
  const activityIcon = `[${type}]`;
  const lockIcon = "[LOCK]";
  const photoIcon = "[P]";
  const commuteIcon = "[C]";

  //// return ////

  // !! animate marker along path to show direction?
  return (
    <div className="activity">
      <div>
        {activityIcon} <b>{name}</b> {isPrivate && lockIcon}{" "}
        {isCommute && commuteIcon} at {startDateLocal.substring(11, 16)}
      </div>

      {/* // !!! add icons for each; ruler, stopwatch, speedometer */}
      <div>
        {formatMeters(distance)} -- {formatSeconds(movingTime)} /{" "}
        {formatSeconds(elapsedTime)} --{" "}
        {displayPace
          ? formatMpsAsPace(averageSpeed)
          : formatMpsAsSpeed(averageSpeed)}
      </div>

      <div style={{ width: mapWidth, margin: "auto", padding: 10 }}>
        <MapContainer
          style={{
            width: mapWidth,
            height: mapHeight,
            zIndex: 99,
          }}
          // !!! add button somewhere to re-center/zoom
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
