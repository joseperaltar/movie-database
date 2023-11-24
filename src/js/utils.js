function formatDuration(duration) {
  let hour = Math.trunc(duration / 60);
  let minutes = Math.round((duration / 60 - hour) * 60);
  let totalTime = `${hour}hr ${minutes}m`
  return totalTime;
}

export { formatDuration };