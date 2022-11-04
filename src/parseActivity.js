// !!! reorganize files

const parseActivity = (activity) => ({
  id: activity.id,
  name: activity.name,
  type: activity.type,
  distanceInKm: Math.floor(activity.distance / 10) / 100,
  movingTime: activity.moving_time,
  elapsedTime: activity.elapsed_time,
  // !!! just take the local time, not day; rename startTimeLocal
  startDateLocal: activity.start_date_local,
  polyline: activity.map.summary_polyline,
  isCommute: activity.commute,
  isPrivate: activity.private,
  averageSpeed: activity.average_speed,
});

export default parseActivity;
