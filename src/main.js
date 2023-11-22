import { fetchInfo } from "./js/apiHandler.js";
import { toggleFilters, renderHomePage, renderMovieDetails, renderSearch, renderTrendings } from "./js/render.js";

const ENDPOINTS = {
  trending: "/trending/movie/day",
  genres: "/genre/movie/list",
  movie: "/movie/",
  queryMovie: "/search/movie",
  queryFilterMovie: "/discover/movie"
};

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
  else if(location.hash.replace("#", "").startsWith("search")) route = "search";
  else if(location.hash.replace("#", "").startsWith("trendings")) route = "trendings";
  return route;
}

async function render() {
  window.scroll(0,0);
  if(navigator() === 'home') {
    const movies = await fetchInfo(ENDPOINTS.trending);
    const genres = await fetchInfo(ENDPOINTS.genres);
    renderHomePage(movies.results, genres.genres);
  } 
  else if(navigator() === "movie") {
    renderMovieDetails(await getMovie());
  } 
  else if(navigator() === "search") {
    const  re = /=[a-zA-Z0-9]*$/g;
    const searchQuery = location.hash.replace("#", "").match(re)[0].replace("=","");
    const data = await fetchInfo(`${ENDPOINTS.queryMovie}`, {query: searchQuery});
    renderSearch(data.results);
  } 
  else if(navigator() === "categorie") {
    const  re = /=[a-zA-Z0-9]*$/g;
    const searchQuery = location.hash.replace("#", "").match(re)[0].replace("=","");
    const data = await fetchInfo(`${ENDPOINTS.queryFilterMovie}`, {with_genre: searchQuery});
    renderSearch(data.results);
  }
  else if(navigator() === "trendings") {
    const data = await fetchInfo(`${ENDPOINTS.trending}`);
    renderTrendings(data.results);
  }
}

async function renderFilters() {

  const genres = await fetchInfo(ENDPOINTS.genres);

  const genreList = document.querySelector(".genre-list");

  const categoriesEL = genres.genres.map(genre => {
    const genreContainer = document.createElement("option");

    genreContainer.innerText = genre.name;
    genreContainer.value = genre.id;

    return genreContainer;
  })

  genreList.append(...categoriesEL);
}

async function bindAppEvents() {
  const app = {
    header: {
      title: document.querySelector('.app-title'),
      searchBar: document.querySelector(".search_bar"),
      searchButton: document.querySelector(".search_button"),
      filterButton: document.querySelector(".search_filter")
    },
    body: {
      viewMoreButton: document.querySelector(".trending_view-more")
    },
    filter: {
      applyButton: document.querySelector(".filter-apply"),
      cancelButton: document.querySelector(".filter-cancel")
    }
  };


  window.addEventListener('hashchange', async (e)=>{
    await render();
  });

  app.header.title
    .addEventListener('click', ()=>location.hash = "");

  app.header.searchButton
    .addEventListener('click', (e)=>{
      e.preventDefault();
      if(app.header.searchBar.value.trim() !== "") location.hash = `search=${app.header.searchBar.value.trim()}`;
      app.header.searchBar.value = "";
    });
    
  app.body.viewMoreButton
    .addEventListener('click', ()=>location.hash = "trendings");

  app.header.filterButton
    .addEventListener("click", async ()=>{
      toggleFilters();
    });

  app.filter.applyButton
    .addEventListener("click", ()=>{
      toggleFilters();
    })

  app.filter.cancelButton
  .addEventListener("click", ()=>{
    toggleFilters();
  })

  document.querySelector(".movie .back_button")
    .addEventListener("click", ()=>{history.back()});
}

async function app() {
  await render();
  await renderFilters();
  await bindAppEvents();
}

app();