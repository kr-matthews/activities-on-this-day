import strings from "../strings";

import tileLayers from "./tileLayers";

export default function Options({
  options = {},
  optionSetters = {},
  resetAll,
}) {
  //// return ////
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "AliceBlue",
      }}
    >
      <b>{strings.headings.options}</b> - {strings.labels.tileLayer}:{" "}
      <select
        value={options.tileLayerName}
        onChange={(e) => optionSetters.setTileAndColour(e.target.value)}
      >
        {Object.keys(tileLayers).map((tileLayerName) => (
          <option key={tileLayerName} value={tileLayerName}>
            {tileLayerName}
          </option>
        ))}
      </select>{" "}
      {strings.labels.lineColour}:{" "}
      <input
        type="color"
        value={options.lineColour}
        onChange={(e) => optionSetters.setLineColour(e.target.value)}
      />{" "}
      {strings.labels.lineWeight}:{" "}
      <input
        type="number"
        value={options.lineWeight}
        onChange={(e) => optionSetters.setLineWeight(Number(e.target.value))}
      />{" "}
      <button onClick={resetAll}>{strings.labels.resetOptions}</button>
    </div>
  );
}
