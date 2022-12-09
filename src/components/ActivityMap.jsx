import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  useMap,
  Circle,
} from "react-leaflet";
import polyline from "@mapbox/polyline";

import usePathAnimation from "../hooks/usePathAnimation";
import tileLayers from "../data/tileLayers";

import crosshairIconUrl from "../assets/crosshair.svg";
import cornersIconUrl from "../assets/corners.svg";

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

  // !!! remove; use pathAnimation via buttons
  useEffect(() => {
    setTimeout(() => {
      ((f, x) => {
        f(x);
        // hack to avoid lint complaining about plugging in true to start
      })(pathAnimation.start, true);
    }, 1000);
    setTimeout(pathAnimation.pause, 3000);
    setTimeout(pathAnimation.resume, 5000);
    setTimeout(pathAnimation.stopLooping, 10000);
  }, [
    pathAnimation.start,
    pathAnimation.pause,
    pathAnimation.resume,
    pathAnimation.stopLooping,
  ]);

  //// return ////

  // !!! infinite rerenders

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
        <MoreMapOptions
          bounds={bounds}
          toggleModal={toggleModal}
          isMaximized={isMaximized}
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
          // !!! extract as component
          <Circle
            center={pathAnimation.position}
            // !!! radius dependent on distance, or default map width?
            radius={60}
            pathOptions={{ color: lineColour, weight: lineWeight }}
          />
        )}
      </MapContainer>
    </div>
  );
}

function MoreMapOptions({ bounds, toggleModal, isMaximized }) {
  const map = useMap();

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
        </div>
      </div>
    </div>
  );
}
