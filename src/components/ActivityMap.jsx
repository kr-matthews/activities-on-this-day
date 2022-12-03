import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";

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

  //// return ////

  // todo: FANCY - animate marker along path to show direction?
  return (
    <div
      style={{
        width: mapWidth,
        margin: "auto",
        // don't ask...
        paddingRight: isMaximized ? 3 : 5,
        paddingTop: isMaximized ? "2vh" : 0,
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
        />
      </MapContainer>
    </div>
  );
}

function MoreMapOptions({ bounds, toggleModal, isMaximized }) {
  const map = useMap();

  // mimic the existing zoom controls, applying analogous classes
  return (
    <div className="leaflet-control-container">
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
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
