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
  newUrl: "",
  scroll: ""
};

function bindExternalEvents() {
  history.scroll = window.scrollY;
  window.addEventListener("scroll", ()=>{
    if(window.scrollY > history.scroll && window.scrollY >= 40) {
      App.$.barnav.classList.add("hide");
      App.$.barnav.classList.remove("show");
    } else if (window.scrollY >= 40) {
      App.$.barnav.classList.remove("hide");
      App.$.barnav.classList.add("show");
    }
    history.scroll = window.scrollY;
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

  context: {trendingMovies: [], popularMovies: [], searchedMovies: []},
  setContext: (contextKey, newContextValue) => {
    App.context[contextKey] = newContextValue;
  },


  showHeader: (show)=>{
    App.$.header.style.display = show ? "block" : "none";
    App.$.barnav.classList.remove("hide");
    App.$.barnav.classList.remove("show");
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
    App.showHeader(true);
    App.showHome(true);
    App.showFooter(true);
    App.showSearch(false);
    App.showMovieDetails(false);

    App.setContext("trendingMovies", await API.fetchMovies(""));
    App.setContext("popularMovies", await fetchInfo(ENDPOINTS.movie+"popular"));

    renderMovies(App.context.trendingMovies, App.$.trendingPreviewList);
    renderMovies(App.context.popularMovies.results, App.$.popularPreviewList);
  },
  renderSearch: async () => {
    App.showHeader(true);
    App.showSearch(true);
    App.showHome(false);
    App.showMovieDetails(false);
    const params = await getParams()
    App.setContext("searchedMovies", await API.fetchMovies({"query": params.search}));
    renderMovies(App.context.searchedMovies, App.$.searchResultsList);
    App.$.searchResultTitle.innerText = `Showing results for ${params.search}`;
  },
  renderMovie: async ()=>{
    const params = await getParams();
    const movie = await fetchInfo(ENDPOINTS.movie+params.movie);
    renderMovieDetails(movie);
    App.showMovieDetails(true);
  },
  bindEvents: () => {
    /* Home redirect */

    App.$.title.addEventListener("click", ()=>location.hash = "");

    /* Search Redirect */

    App.$.searchButton.addEventListener("click", (e)=>{
      e.preventDefault();
      if(App.$.searchBar.value.trim() !== "") location.hash = `search=${App.$.searchBar.value.trim()}`;
      App.$.searchBar.value = "";
    });

    /* Open & close movie preview events */

    App.$.backButton.addEventListener("click", ()=>{{
      App.$.movieDetails.classList.add("slideout");
      App.$.movieDetails.classList.remove("slidein");
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
    App.$.trendingPreviewList.addEventListener("click", (e)=>{
      if(e.target.tagName === "IMG") {
       const movie = App.context.trendingMovies.find((movie)=>movie.id === Number(e.target.dataset.id));
       renderMovieDetails(movie);
       App.showMovieDetails(true);
      }
    });
    App.$.popularPreviewList.addEventListener("click", (e)=>{
      if(e.target.tagName === "IMG") {
       const movie = App.context.trendingMovies.find((movie)=>movie.id === Number(e.target.dataset.id));
       renderMovieDetails(movie);
       App.showMovieDetails(true);
      }
    });
    App.$.searchResultsList.addEventListener("click", (e)=>{
      if(e.target.tagName === "IMG") {
       const movie = App.context.searchedMovies.find((movie)=>movie.id === Number(e.target.dataset.id));
       renderMovieDetails(movie);
       App.showMovieDetails(true);
      }

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