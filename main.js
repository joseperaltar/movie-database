import { fetchInfo } from "./js/apiHandler.js";
import { renderMovieDetails, renderMovies } from "./js/render.js";
import { navigator } from "./js/navigator.js";

const ENDPOINTS = {
  trending: "/trending/movie/day",
  genres: "/genre/movie/list",
  movie: "/movie/",
  queryMovie: "/search/movie",
  queryFilterMovie: "/discover/movie"
}; 

let history = {
  oldUrl: "",
  newUrl: ""
};

function bindExternalEvents() {
  let scroll = window.scrollY;
  document.addEventListener("animationend", (e)=>{
    if(e.animationName === "slidein") {
      window.scroll(0,0);
      App.showFooter(false);
      App.showHeader(false);
      App.showHome(false);
      App.showSearch(false);
    }
  });
  document.addEventListener("animationstart", (e)=>{
    if(e.animationName === "slideout") {
      App.showFooter(true);
      App.showHeader(true);
      App.showHome(true);
    }
  })
  window.addEventListener("scroll", ()=>{
    if(window.scrollY > scroll) {
      App.$.barnav.classList.add("hide");
      App.$.barnav.classList.remove("show");
    } else {
      App.$.barnav.classList.remove("hide");
      App.$.barnav.classList.add("show");
    }
    scroll = window.scrollY
  });
  window.addEventListener("hashchange", (e)=>{
    const re = /#.*$/g;
    App.render();
    e.oldURL.match(re) === null ? 
      history.oldUrl = "#":
      history.oldUrl = e.oldURL.match(re)[0];
  });
}

const API = {
  fetchMovies: async(query)=>{
    let endpoint;
    if (query) endpoint = ENDPOINTS.queryMovie;
    else endpoint = ENDPOINTS.trending;
    const movies = await fetchInfo(endpoint, query);
    return movies.results;
  },
  fetchGenres: async ()=>{
    const genres = await fetchInfo(ENDPOINTS.genres);
    return genres.genres
  },
  fetchMoviesWithGenre: async(categorie) => {
    const movies = await fetchInfo(ENDPOINTS.queryFilterMovie, {with_genres: categorie});
    return movies.results;
  }
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

const App = {
  $: {
    header: document.querySelector(".app-header"),
    barnav: document.querySelector(".barnav"),
    title: document.querySelector(".barnav h1"),
    searchButton: document.querySelector(".search_button"),
    searchBar: document.querySelector(".search_bar"),
    trendingPreview: document.querySelector(".trending-preview"),
    trendingPreviewList: document.querySelector(".trending-preview_list"),
    popularPreview: document.querySelector(".popular-preview"),
    popularPreviewList: document.querySelector(".popular-preview_list"),
    searchResults: document.querySelector(".search-results"),
    searchResultsList: document.querySelector(".search-results_list"),
    searchResultTitle: document.querySelector(".search-results .subtitle"),
    movieDetails: document.querySelector(".movie-details"),
    backButton: document.querySelector(".back_button"),
    footer: document.querySelector(".footer"),
  },
  showHeader: (show)=>{
    App.$.header.style.display = show ? "block" : "none";
  },
  showHome: (show)=>{
    App.$.trendingPreview.style.display = show ? "block" : "none";
    App.$.popularPreview.style.display = show ? "block" : "none";
  },
  showSearch: (show)=>{
    App.$.searchResults.style.display = show ? "block" : "none";
  },
  showFooter: (show)=>{
    App.$.footer.style.display = show ? "flex" : "none";
  },
  showMovieDetails: (show)=>{
    App.$.movieDetails.style.display = show ? "block" : "none";
  },
  renderHome: async ()=>{
    const trendingMovies = await API.fetchMovies("");
    const popularMovies = await fetchInfo(ENDPOINTS.movie+"popular");
    renderMovies(trendingMovies, App.$.trendingPreviewList);
    renderMovies(popularMovies.results, App.$.popularPreviewList);
    App.showHeader(true);
    App.showHome(true);
    App.showSearch(false);
    App.showMovieDetails(false);
  },
  renderSearch: async () => {
    const params = await getParams()
    const movies = await API.fetchMovies({"query": params.search});
    renderMovies(movies, App.$.searchResultsList);
    App.$.searchResultTitle.innerText = `Showing results for ${params.search}`;
    App.showHeader(true);
    App.showHome(false);
    App.showSearch(true);
    App.showMovieDetails(false);
  },
  renderMovie: async ()=>{
    const params = await getParams();
    const movie = await fetchInfo(ENDPOINTS.movie+params.movie);
    renderMovieDetails(movie);
    App.showMovieDetails(true)
  },
  bindEvents: () => {
    App.$.title.addEventListener("click", ()=>location.hash = "");
    App.$.searchButton.addEventListener("click", (e)=>{
      e.preventDefault();
      if(App.$.searchBar.value.trim() !== "") location.hash = `search=${App.$.searchBar.value.trim()}`;
      App.$.searchBar.value = "";
    });
    App.$.backButton.addEventListener("click", ()=>{{
      App.$.movieDetails.classList.add("slideout");
      App.$.movieDetails.classList.remove("slidein");
      location.href = history.oldUrl;
    }});
    App.$.trendingPreviewList.addEventListener("click", ()=>{
      App.$.movieDetails.classList.remove("slideout");
      App.$.movieDetails.classList.add("slidein");
    });
    App.$.popularPreviewList.addEventListener("click", ()=>{
      App.$.movieDetails.classList.remove("slideout");
      App.$.movieDetails.classList.add("slidein");
    });
    App.$.searchResultsList.addEventListener("click", ()=>{
      App.$.movieDetails.classList.add("slidein");
      App.$.movieDetails.classList.remove("slideout")
    });
  },
  selecView: async ()=>{
    navigator() === "home" ? await App.renderHome() : 
    navigator() === "movie" ? await App.renderMovie() : 
    navigator() === "search" ? await App.renderSearch() : App.render404();
  },
  render: ()=>{
    App.selecView();
  },
  init: async ()=>{
    if(history.oldUrl === "") {
      App.showHeader(false);
      App.showHome(false);
      App.showFooter(false)
      App.showMovieDetails(false);
    }
    App.render();
    App.bindEvents();
    bindExternalEvents();
  }
} 

App.init();