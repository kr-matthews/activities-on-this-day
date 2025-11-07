const parseActivity = (activity) => ({
  id: activity.id,
  name: activity.name,
  type: activity.type,
  distance: activity.distance,
  movingTime: activity.moving_time,
  elapsedTime: activity.elapsed_time,
  startDate: activity.start_date,
  startDateLocal: activity.start_date_local,
  polyline: activity.map.summary_polyline,
  isCommute: activity.commute,
  isPrivate: activity.private,
  averageSpeed: activity.average_speed,
  photoCount: activity.total_photo_count,
  totalElevationGain: activity.total_elevation_gain,
  deviceName: activity.device_name,
});

export { parseActivity };
