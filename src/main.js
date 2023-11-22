import { fetchInfo } from "./js/apiHandler.js";
import { renderHomePage, renderMovie } from "./js/render.js";

const ENDPOINTS = {
  trending: "/trending/movie/day",
  genres: "/genre/movie/list",
  movie: "/movie/"
}

async function getMovie() {
  const  re = /=[0-9]*$/g;
  const  movieid = location.hash.replace("#", "").match(re)[0].replace("=","");
  const movie =  await fetchInfo(`${ENDPOINTS.movie}/${movieid}`);
  return movie;
}

function navigator() {
  let route;
  if(location.hash === '') route = "home";
  else if(location.hash.replace("#", "").startsWith("movie")) route = "movie";
  else if(location.hash.replace("#", "").startsWith("categorie")) route = "categorie";
  else if(location.hash.replace("#", "").startsWith("search")) route = "search"
  return route;
}

async function render() {
  if(navigator() === 'home') {
    const movies = await fetchInfo(ENDPOINTS.trending);
    const genres = await fetchInfo(ENDPOINTS.genres);
    renderHomePage(movies.results, genres.genres);
  } else if(navigator() === "movie") {
    renderMovie(await getMovie());
  }
}

async function app() {
  const app = {
    header: {
      title: document.querySelector('.app-title'),
      searchBar: document.querySelector(".search_bar"),
      searchButton: document.querySelector(".search_button")
    },
    body: {
      viewMoreButton: document.querySelector(".trending_view-more")
    }
  };

  await render();

  window.addEventListener('hashchange', async ()=>{
    await render();
  });

  app.header.title
    .addEventListener('click', ()=>location.hash = "");
  app.header.searchButton
    .addEventListener('click', ()=>{
      if(app.header.searchBar.value.trim() !== "") location.hash = `search=${app.header.searchBar.value.trim()}`;
    });
  app.body.viewMoreButton
    .addEventListener('click', ()=>location.hash = "trendings");
  document.querySelector(".movie .back_button")
    .addEventListener("click", ()=>{location.hash = ""});
}

app();