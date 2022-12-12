import { useReducer, useCallback, useEffect } from "react";

const initialState = (maxIndex) => ({
  index: null,
  maxIndex,
  isLooping: null,
  status: "reset",
});

const reducer = (state, action) => {
  const { index, maxIndex, isLooping, status } = state;
  switch (action.type) {
    case "start":
      if (status !== "reset") return state;
      return {
        index: 0,
        maxIndex,
        isLooping: action.isLooping ?? false,
        status: "active",
      };

    case "pause":
      if (status !== "active") return state;
      return { index, maxIndex, isLooping, status: "paused" };

    case "resume":
      if (status !== "paused") return state;
      return { index, maxIndex, isLooping, status: "active" };

    case "unloop":
      if (status === "reset") return state;
      return { index, maxIndex, isLooping: false, status };

    case "reset":
      return initialState(maxIndex);

    case "advance":
      if (status !== "active") return state;
      if (index < maxIndex || isLooping) {
        return {
          index: (index + 1) % (maxIndex + 1),
          maxIndex,
          isLooping,
          status,
        };
      }
      return initialState(maxIndex);

    default:
      console.error("Invalid path animation action", action.type);
      return state;
  }
};

export default function usePathAnimation(positions, { distance }) {
  //// state ////

  const positionCount = positions.length;
  const [{ index, isLooping, status }, dispatch] = useReducer(
    reducer,
    positionCount - 1,
    initialState
  );

  //// values ////

  const position = index !== null ? positions[index] : null;

  // exactly 1 should be true
  const isReset = status === "reset";
  const isActive = status === "active";
  const isPaused = status === "paused";

  //// functions ////

  const advance = useCallback(() => dispatch({ type: "advance" }), [dispatch]);

  const start = useCallback(
    (isLooping = false) => dispatch({ type: "start", isLooping }),
    [dispatch]
  );
  const pause = useCallback(() => dispatch({ type: "pause" }), [dispatch]);
  const resume = useCallback(() => dispatch({ type: "resume" }), [dispatch]);
  const reset = useCallback(() => dispatch({ type: "reset" }), [dispatch]);
  const stop = reset;
  const stopLooping = useCallback(
    () => dispatch({ type: "unloop" }),
    [dispatch]
  );

  //// effects ////

  useEffect(() => {
    if (status === "active") {
      setTimeout(
        advance,
        // 4km -> 2 * 2 = 4 sec; 100km -> 2 * 10 = 20 sec
        (2 * Math.sqrt(distance / 1000) * 1000) / positionCount
      );
    }
  }, [status, index, advance, distance, positionCount]);

  //// return ////

  return {
    status,
    isReset,
    isActive,
    isPaused,
    isLooping,
    position,
    start,
    pause,
    resume,
    reset,
    stop,
    stopLooping,
  };
}
