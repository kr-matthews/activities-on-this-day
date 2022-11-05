const parseActivity = (activity) => ({
  id: activity.id,
  name: activity.name,
  type: activity.type,
  distanceInKm: Math.floor(activity.distance / 10) / 100,
  movingTime: activity.moving_time,
  elapsedTime: activity.elapsed_time,
  // note: can easily display local times by creating date object with this
  startDate: activity.start_date,
  polyline: activity.map.summary_polyline,
  isCommute: activity.commute,
  isPrivate: activity.private,
  averageSpeed: activity.average_speed,
  photoCount: activity.total_photo_count,
});

export { parseActivity };
