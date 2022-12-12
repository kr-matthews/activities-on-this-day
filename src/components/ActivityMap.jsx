import {
  MapContainer,
  TileLayer,
  Polyline,
  useMap,
  CircleMarker,
} from "react-leaflet";
import polyline from "@mapbox/polyline";

import usePathAnimation from "../hooks/usePathAnimation";
import tileLayers from "../data/tileLayers";

import crosshairIconUrl from "../assets/crosshair.svg";
import cornersIconUrl from "../assets/corners.svg";
import playIcon from "../assets/play.svg";
import playOnceIcon from "../assets/play-once.svg";
import playLoopIcon from "../assets/play-loop.svg";
import pauseIcon from "../assets/pause.svg";
import stopIcon from "../assets/stop.svg";

import "./activityMap.css";

export default function ActivityMap({
  activityPolyline,
  lineColour = "#603cba",
  lineWeight = 3,
  tileLayerName = "default",
  mapWidth = 300,
  mapHeight = 300,
  toggleModal,
  isMaximized,
  data,
}) {
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

  //// animation ////

  const pathAnimation = usePathAnimation(positions, data);

  //// return ////

  return (
    <div
      style={{
        width: mapWidth,
        margin: "auto",
        // don't ask... todo: fix awkwardly coded positioning
        paddingRight: isMaximized ? "0.5vw" : 5,
        paddingTop: isMaximized ? "1.75vh" : 0,
      }}
    >
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
        <MoreMapControls
          bounds={bounds}
          toggleModal={toggleModal}
          isMaximized={isMaximized}
          pathAnimation={pathAnimation}
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
          onClick={() => console.debug("test")}
        />
        {pathAnimation.position !== null && (
          <CircleMarker
            center={pathAnimation.position}
            radius={12}
            pathOptions={{ color: lineColour, weight: lineWeight }}
          />
        )}
      </MapContainer>
    </div>
  );
}

function MoreMapControls({ bounds, toggleModal, isMaximized, pathAnimation }) {
  const map = useMap();
  const { isActive, isPaused, start, pause, resume, reset, stop } =
    pathAnimation;

  const playPauseText = isActive ? "Pause" : isPaused ? "Resume" : "Play Once";
  const stopResetText = isActive ? "Stop" : isPaused ? "Reset" : "Play on Loop";
  const playPauseIcon = isActive
    ? pauseIcon
    : isPaused
    ? playIcon
    : playOnceIcon;
  const stopResetIcon = isActive
    ? stopIcon
    : isPaused
    ? stopIcon
    : playLoopIcon;
  const playPauseAction = () => {
    if (isActive) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start(false);
    }
  };
  const stopResetAction = () => {
    if (isActive) {
      stop();
    } else if (isPaused) {
      reset();
    } else {
      start(true);
    }
  };

  // mimic the existing zoom controls, applying analogous elements & classes
  // react doesn't like the anchors, but the styling won't apply otherwise, hence disable eslint
  return (
    <div className="leaflet-control-container">
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
          {/* eslint-disable-next-line */}
          <a
            className="leaflet-control-zoom-in"
            title={isMaximized ? "Minimize" : "Maximize"}
            role="button"
            aria-label={isMaximized ? "Minimize" : "Maximize"}
            aria-disabled="false"
            onClick={toggleModal}
          >
            <span area-hidden="true">
              <img src={cornersIconUrl} alt="size" />
            </span>
          </a>

          {/* eslint-disable-next-line */}
          <a
            className="leaflet-control-zoom-out"
            title="Re-center"
            role="button"
            aria-label="Re-center"
            aria-disabled="false"
            onClick={() => map.fitBounds(bounds)}
          >
            <span area-hidden="true">
              <img src={crosshairIconUrl} alt="center" />
            </span>
          </a>

          {/* eslint-disable-next-line */}
          <a
            className="leaflet-control-zoom-in"
            title={playPauseText}
            role="button"
            aria-label={playPauseText}
            aria-disabled="false"
            onClick={playPauseAction}
          >
            <span area-hidden="true">
              <img src={playPauseIcon} alt={playPauseText} />
            </span>
          </a>

          {/* eslint-disable-next-line */}
          <a
            className="leaflet-control-zoom-out"
            title={stopResetText}
            role="button"
            aria-label={stopResetText}
            aria-disabled="false"
            onClick={stopResetAction}
          >
            <span area-hidden="true">
              <img src={stopResetIcon} alt={stopResetText} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

// reset            -> play once; play looped
// active, no loop  -> pause;     stop
// active, loop     -> pause;     stop;       de-loop
// paused, no loop  -> resume;    reset
// paused, loop     -> resume;    reset;      de-loop

// omit de-looping (or don't allow stopping while on loop)
