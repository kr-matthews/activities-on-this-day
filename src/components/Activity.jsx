import { useState, useCallback } from "react";

import ActivityMap from "./ActivityMap";
import MapModal from "./MapModal";

import strings from "../data/strings";
import {
  formatSeconds,
  formatMetersAsKm,
  formatMpsAsPace,
  formatMpsAsSpeed,
  formatMetersAsM,
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
import elevationIconUrl from "../assets/mountain.svg";
import cameraIconUrl from "../assets/camera.svg";

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
    polyline,
    isCommute,
    isPrivate,
    averageSpeed,
    totalElevationGain,
    photoCount,
    deviceName,
  },
  lineColour = "#603cba",
  lineWeight = 3,
  tileLayerName = "default",
  mapWidth = 300,
  mapHeight = 300,
}) {
  //// link ////

  const linkToActivity = `https://www.strava.com/activities/${id}`;

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
        // todo: UI - 'other' type icon - a watch?
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
  const elevationIcon = (
    <img
      className="icon"
      title="Total Elevation Gain"
      src={elevationIconUrl}
      alt="Elevation Gain"
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
  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);

  //// return ////

  return (
    <div className="activity">
      {isModalOpen && (
        <MapModal closeModal={closeModal}>
          <ActivityMap
            activityPolyline={polyline}
            lineColour={lineColour}
            lineWeight={lineWeight}
            tileLayerName={tileLayerName}
            mapWidth="85vw"
            mapHeight="85vh"
            isMaximized
            toggleModal={closeModal}
            data={{ distance, movingTime, averageSpeed }}
          />
        </MapModal>
      )}
      <ActivityMap
        activityPolyline={polyline}
        lineColour={lineColour}
        lineWeight={lineWeight}
        tileLayerName={tileLayerName}
        mapWidth={mapWidth}
        mapHeight={mapHeight}
        toggleModal={openModal}
        data={{ distance, movingTime, averageSpeed }}
      />

      <div className="activity-data">
        <div style={{ padding: 5, marginBottom: 12 }}>
          <b>{name}</b>
        </div>

        <div className="icon-row" style={{ margin: "auto", marginBottom: 5 }}>
          {activityIcon}
          {isPrivate && privateIcon}
          {isCommute && commuteIcon}
        </div>

        <div
          title={deviceName}
          style={{
            margin: "auto",
            fontSize: "90%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            paddingLeft: "5px",
            fontStyle: "italic",
            cursor: "help",
          }}
        >
          {deviceName}
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
              <td>{formatMetersAsKm(distance)}</td>
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

            <tr>
              <td>{elevationIcon}</td>
              <td>{formatMetersAsM(totalElevationGain)}</td>
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
