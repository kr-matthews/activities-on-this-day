//// duration ////

export const formatSeconds = (s) => {
  return `${hoursOf(s)}${minutesOf(s)}${secondsOf(s)}`;
};

const secondsOf = (s) => {
  const r = s % 60;
  if (s <= 0) return "0s";
  if (s < 60) return `${s}s`;
  if (r === 0) return "00s";
  if (r < 10) return `0${r}s`;
  return `${r}s`;
};

const minutesOf = (s) => {
  const m = Math.floor(s / 60);
  const r = m % 60;
  if (m <= 0) return "";
  if (m < 60) return `${m}m `;
  if (r === 0) return "00m ";
  if (r < 10) return `0${r}m `;
  return `${r}m `;
};

const hoursOf = (s) => {
  const h = Math.floor(s / 60 / 60);
  if (h <= 0) return "";
  return `${h}h `;
};

//// distance ////

export const formatMeters = (m) => {
  return `${kmOf(m)}.${decimalsOf(m)}km`;
};

const decimalsOf = (m) => {
  return (Math.floor(m) % 1000).toString().padStart(3, "0").substring(0, 2);
};

const kmOf = (m) => {
  return Math.floor(m / 1000);
};

//// speed / pace ////

export const formatMpsAsSpeed = (mps) => {
  return `${formatKph(mps * (3600 / 1000))}km/h`;
};

const formatKph = (kph) => {
  const [before, after] = kph.toString().split(".");
  return `${before}.${(after || "0").substring(0, 1)}`;
};

export const formatMpsAsPace = (mps) => {
  return `${formatSeconds(Math.floor(1000 / mps))} /km`;
};
