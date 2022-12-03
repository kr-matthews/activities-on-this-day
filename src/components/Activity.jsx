import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";

import MapModal from "./MapModal";

import strings from "../data/strings";
import tileLayers from "../data/tileLayers";
import {
  formatSeconds,
  formatMeters,
  formatMpsAsPace,
  formatMpsAsSpeed,
} from "../utils/displayUtils";

import rideIconUrl from "../assets/bike.svg";
import runIconUrl from "../assets/runner.svg";
// import walkIconUrl from "../assets/walker.svg";
import walkIconUrl from "../assets/footprints.svg";
import hikeIconUrl from "../assets/hiker.svg";
import lockIconUrl from "../assets/lock.svg";
import commuteIconUrl from "../assets/briefcase.svg";
import clockIconUrl from "../assets/clock.svg";
import rulerIconUrl from "../assets/ruler.svg";
import timerIconUrl from "../assets/timer.svg";
import speedIconUrl from "../assets/speedometer.svg";
import cameraIconUrl from "../assets/camera.svg";
import crosshairIconUrl from "../assets/crosshair.svg";
import cornersIconUrl from "../assets/corners.svg";

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
        // !!! UI - 'other' type icon - a watch?
        return "";
    }
  };

  const activityIcon = (
    <img
      className="icon"
      title={`Activity Type: ${type}`}
      src={getActivityTypeIconUrl(type)}
      alt={`${type}`}
    />
  );
  const privateIcon = (
    <img
      className="icon"
      title={"This activity is private."}
      src={lockIconUrl}
      alt="Private"
    />
  );
  const commuteIcon = (
    <img
      className="icon"
      title={"This activity was a commute."}
      src={commuteIconUrl}
      alt="Commute"
    />
  );

  const timeIcon = (
    <img className="icon" title={"Start Time"} src={clockIconUrl} alt="Time" />
  );
  const distanceIcon = (
    <img
      className="icon"
      title={"Distance"}
      src={rulerIconUrl}
      alt="Distance"
    />
  );
  const durationIcon = (
    <img className="icon" title={"Duration"} src={timerIconUrl} alt="Time" />
  );
  const speedIcon = (
    <img
      className="icon"
      title={shouldDisplayPace ? "Pace" : "Speed"}
      src={speedIconUrl}
      alt={shouldDisplayPace ? "Pace" : "Speed"}
    />
  );

  const photosIcon = (
    <img
      className="icon"
      title={"This activity has photos, see them on Strava."}
      src={cameraIconUrl}
      alt="Photos"
    />
  );

  //// full-screen ////

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

  //// return ////

  // todo: FANCY - animate marker along path to show direction?
  return (
    <div className="activity">
      {isModalOpen && <MapModal closeModal={closeModal} />}
      <div style={{ width: mapWidth, margin: "auto", paddingRight: 5 }}>
        <MapContainer
          style={{
            width: mapWidth,
            height: mapHeight,
            // just below the options header, which is set to 100
            zIndex: 99,
            border: "solid",
          }}
          bounds={bounds}
          scrollWheelZoom
        >
          <MoreMapOptions
            bounds={bounds}
            openModal={() => setIsModalOpen(true)}
          />
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

      <div className="activity-data">
        <div style={{ padding: 5, marginBottom: 12 }}>
          <b>{name}</b>
        </div>

        <div className="icon-row" style={{ margin: "auto", marginBottom: 5 }}>
          {activityIcon}
          {isPrivate && privateIcon}
          {isCommute && commuteIcon}
        </div>

        <table style={{ maxWidth: 190, margin: "auto" }}>
          <tbody>
            <tr>
              <td style={{ width: "35px" }}>{timeIcon}</td>
              <td style={{ width: "100px" }}>
                {startDateLocal.substring(11, 16)}
              </td>
            </tr>

            <tr>
              <td>{distanceIcon}</td>
              <td>{formatMeters(distance)}</td>
            </tr>

            <tr>
              <td>{durationIcon}</td>
              <td>
                <div>{formatSeconds(movingTime)}</div>
                <div>{formatSeconds(elapsedTime)}</div>
              </td>
            </tr>

            <tr>
              <td>{speedIcon}</td>
              <td>
                {shouldDisplayPace
                  ? formatMpsAsPace(averageSpeed)
                  : formatMpsAsSpeed(averageSpeed)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="activity-link">
          <div>{photoCount > 0 && photosIcon}</div>
          <a href={linkToActivity} target="_blank" rel="noopener noreferrer">
            {strings.labels.viewOnStrava}
          </a>
        </div>
      </div>
    </div>
  );
}

// not very re-usable...
function MoreMapOptions({ bounds, openModal }) {
  const map = useMap();

  return (
    <div>
      <div
        className="map-option option-top"
        title="Maximize"
        onClick={openModal}
      >
        <img src={cornersIconUrl} alt="center" />
      </div>
      <div
        className="map-option option-bottom"
        title="Re-center"
        onClick={() => map.fitBounds(bounds)}
      >
        <img src={crosshairIconUrl} alt="center" />
      </div>
    </div>
  );
}
