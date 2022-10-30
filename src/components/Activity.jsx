import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";

import strings from "../strings";

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
  mapWidth = 300,
  mapHeight = 300,
}) {
  //// link ////

  const linkToActivity = `https://www.strava.com/activities/${id}`;

  //// position ////

  const positions = polyline.decode(activityPolyline);

  // latitude

  const latMin = Math.min(
    Math.min(...positions.map((position) => position[0]))
  );
  const latMax = Math.max(
    Math.max(...positions.map((position) => position[0]))
  );
  const latitude = (latMax + latMin) / 2;

  // longitude

  const longMin = Math.min(
    Math.min(...positions.map((position) => position[1]))
  );
  const longMax = Math.max(
    Math.max(...positions.map((position) => position[1]))
  );
  const longitude = (longMax + longMin) / 2;

  //// size & zoom ////

  // const deltaLat = (latMax - latMin) / 2;
  // const deltaLong = (longMax - longMin) / 2;
  // !!! calculate zoom based on above & mapWidth, mapHeight
  const zoom = 12; // ~

  //// return ////

  // !!! look into path options on PolyLine
  // !!! display activity data before map properly
  // !!! look into map layers/options
  return (
    <>
      <div>
        {startDateLocal} -- {type} {distanceInKm}km -- <b>{name}</b>
      </div>

      <MapContainer
        style={{ width: mapWidth, height: mapHeight }}
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={positions} />
      </MapContainer>

      <a href={linkToActivity} target="_blank" rel="noopener noreferrer">
        {strings.labels.viewOnStrava}
      </a>
    </>
  );
}
