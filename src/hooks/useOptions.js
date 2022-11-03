import tileLayers from "../components/tileLayers";
import { useSavedState } from "./useSavedState";

export default function useOptions() {
  //// states ////

  const [tileLayerName, setTileLayerName] = useSavedState("tile", "default");
  const [lineColour, setLineColour] = useSavedState("colour", "#603cba");
  const [lineWeight, setLineWeight] = useSavedState("weight", 3);

  const setTileAndColour = (tileLayerName) => {
    setTileLayerName(tileLayerName);
    setLineColour(tileLayers[tileLayerName].recommendedColour);
  };

  const options = { lineColour, lineWeight, tileLayerName };
  const optionSetters = {
    setTileLayerName,
    setLineColour,
    setLineWeight,
    setTileAndColour,
  };

  const resetAll = () => {
    setTileLayerName("default");
    setLineColour("#603cba");
    setLineWeight(3);
  };

  //// return ////

  return {
    options,
    optionSetters,
    resetAll,
  };
}
