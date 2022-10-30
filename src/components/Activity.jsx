import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import strings from "../strings";

import "./activity.css";

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
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <a href={linkToActivity} target="_blank" rel="noopener noreferrer">
        {strings.labels.viewOnStrava}
      </a>
    </>
  );
}
