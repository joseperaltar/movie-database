function formatDuration(duration) {
  let hour = Math.trunc(duration / 60);
  let minutes = Math.round((duration / 60 - hour) * 60);
  let totalTime = `${hour}hr ${minutes}m`
  return totalTime;
}

async function getParams() {
  const  params = location.hash.replace("#", "").split("&");
  let parsedParams = {};
  params.forEach(parameter=>{
    const [key, value] = parameter.split("=");
    parsedParams[key] = value;
  })
  return parsedParams;
}

export { formatDuration, getParams };