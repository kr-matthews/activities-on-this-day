import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";

import strings from "../strings";
import tileLayers from "./tileLayers";

// NOTE: must follow Strava guidelines for linking back to original data
// see https://developers.strava.com/guidelines/#:~:text=3.%20Mandatory%20Linking%20to%20Strava%20Data
export default function Activity({
  activity: {
    id,
    type,
    name,
    distanceInKm,
    startDateLocal,
    polyline: activityPolyline,
  },
  lineColour = "#603cba",
  lineWeight = 3,
  tileLayerName = "default",
  mapWidth = 300,
  mapHeight = 300,
}) {
  //// link ////

  const linkToActivity = `https://www.strava.com/activities/${id}`;

  //// activity path & bounds ////

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

  //// return ////

  // !! display activity data before map properly - include icons for type
  return (
    <>
      <div>
        {startDateLocal} -- {type} {distanceInKm}km -- <b>{name}</b>
      </div>

      <MapContainer
        style={{
          width: mapWidth,
          height: mapHeight,
          zIndex: 99,
          // textAlign: "center", // !!! center map
        }}
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

      <a href={linkToActivity} target="_blank" rel="noopener noreferrer">
        {strings.labels.viewOnStrava}
      </a>
    </>
  );
}
