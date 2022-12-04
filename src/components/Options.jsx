import strings from "../data/strings";
import tileLayers from "../data/tileLayers";

import "./options.css";

export default function Options({
  options = {},
  optionSetters = {},
  resetAll,
}) {
  //// return ////

  return (
    <div className="options">
      <div className="option option-title">
        <b>{strings.headings.options}</b>
      </div>

      <div className="option">
        {strings.labels.tileLayer}:{" "}
        <select
          value={options.tileLayerName}
          onChange={(e) => optionSetters.setTileAndColour(e.target.value)}
        >
          {Object.keys(tileLayers).map((tileLayerName) => (
            <option key={tileLayerName} value={tileLayerName}>
              {tileLayerName}
            </option>
          ))}
        </select>
      </div>

      <div className="option">
        {strings.labels.lineColour}:{" "}
        <input
          type="color"
          style={{ width: 30, height: 20 }}
          value={options.lineColour}
          onChange={(e) => optionSetters.setLineColour(e.target.value)}
        />
      </div>

      <div className="option">
        {strings.labels.lineWeight}:{" "}
        <input
          type="number"
          style={{ width: 30 }}
          value={options.lineWeight}
          onChange={(e) => optionSetters.setLineWeight(Number(e.target.value))}
        />
      </div>

      <div className="option">
        <button onClick={resetAll}>{strings.labels.resetOptions}</button>
      </div>
    </div>
  );
}
