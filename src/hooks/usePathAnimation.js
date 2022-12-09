import { useState } from "react";

export default function usePathAnimation(positions, { distance }) {
  //// values ////

  const [myInterval, setMyInterval] = useState(null);
  const [index, setIndex] = useState(null);
  const [isLoop, setIsLoop] = useState(false);

  const position = index !== null ? positions[index] : null;

  // exactly 1 should be true
  const isReset = index === null;
  const isActive = index !== null && !!myInterval;
  const isPaused = index !== null && !myInterval;

  //// functions ////

  function go(loop = false, initialIndex = 0) {
    setIsLoop(loop);
    setIndex(initialIndex);
    setMyInterval(
      setInterval(
        () =>
          setIndex((oldIndex) => {
            if (oldIndex === null) return null;
            if (oldIndex + 1 === positions.length) {
              if (loop) {
                return 0;
              }
              reset();
              return null;
            }
            return oldIndex + 1;
          }),
        // 4km -> 2 * 2 = 4 sec; 100km -> 2 * 10 = 20 sec
        (2 * Math.sqrt(distance / 1000) * 1000) / positions.length
      )
    );
  }

  function reset() {
    clearInterval(myInterval);
    setMyInterval(null);
    setIndex(null);
    setIsLoop(false);
  }

  function start(loop = false) {
    if (!isReset) return;
    go(loop);
  }

  function stop() {
    if (!isActive) return;
    reset();
  }

  function pause() {
    if (!isActive) return;
    clearInterval(myInterval);
    setMyInterval(null);
  }

  function resume() {
    if (!isPaused) return;
    go(isLoop, index);
  }

  //// return ////

  return {
    isReset,
    isActive,
    isPaused,
    position,
    reset,
    start,
    stop,
    pause,
    resume,
  };
}
