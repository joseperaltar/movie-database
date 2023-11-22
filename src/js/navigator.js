function navigator() {
  let route;
  if(location.hash === '') route = "home";
  else if(location.hash.replace("#", "").startsWith("movie")) route = "movie";
  else if(location.hash.replace("#", "").startsWith("categorie")) route = "categorie";
  else if(location.hash.replace("#", "").startsWith("search")) route = "search";
  else if(location.hash.replace("#", "").startsWith("trendings")) route = "trendings";
  return route;
}

export { navigator };