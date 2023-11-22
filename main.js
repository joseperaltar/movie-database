import { fetchInfo } from "./js/apiHandler.js";
import { renderCategories, renderMovieDetails, renderMovies } from "./js/render.js";
import { navigator } from "./js/navigator.js";

const ENDPOINTS = {
  trending: "/trending/movie/day",
  genres: "/genre/movie/list",
  movie: "/movie/",
  queryMovie: "/search/movie",
  queryFilterMovie: "/discover/movie"
}; 

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
    title: document.querySelector(".app-header h1"),
    searchButton: document.querySelector(".search_button"),
    searchBar: document.querySelector(".search_bar"),
    trendingPreview: document.querySelector(".trending-preview"),
    trendingPreviewList: document.querySelector(".trending-preview_list"),
    viewMoreButton: document.querySelector(".trending-preview_button"),
    categoriesPreview: document.querySelector(".categories-preview"),
    categoriesPreviewList: document.querySelector(".categories-preview_list"),
    searchResults: document.querySelector(".search-results"),
    searchResultsList: document.querySelector(".search-results_list"),
    searchResultTitle: document.querySelector(".search-results .subtitle"),
    movieDetails: document.querySelector(".movie-details"),
    backButton: document.querySelector(".back_button")
  },
  showHeader: (show)=>{
    App.$.header.style.display = show ? "block" : "none";
  },
  showHome: (show)=>{
    App.$.trendingPreview.style.display = show ? "block" : "none";
    App.$.categoriesPreview.style.display = show ? "block" : "none";
  },
  showSearch: (show)=>{
    App.$.searchResults.style.display = show ? "block" : "none";
  },
  showMovieDetails: (show)=>{
    App.$.movieDetails.style.display = show ? "block" : "none";
  },
  renderHome: async ()=>{
    const movies = await API.fetchMovies("");
    const genres = await API.fetchGenres();
    renderMovies(movies, App.$.trendingPreviewList);
    renderCategories(genres, App.$.categoriesPreviewList);
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
  renderGenre: async () => {
    const params = await getParams()
    const [ categoryId, categoryName ] = params.categorie.split("-");
    const movies = await API.fetchMoviesWithGenre(categoryId);
    renderMovies(movies, App.$.searchResultsList);

    App.$.searchResultTitle.innerHTML = categoryName;
    App.showHeader(true);
    App.showHome(false);
    App.showSearch(true);
    App.showMovieDetails(false);
  },
  renderTrending: async ()=>{
    const movies = await API.fetchMovies("");
    renderMovies(movies, App.$.searchResultsList);

    App.$.searchResultTitle.innerHTML = "Trending movies";
    App.showHeader(true);
    App.showHome(false);
    App.showSearch(true);
    App.showMovieDetails(false);
  },
  renderMovie: async ()=>{
    const params = await getParams();
    const movie = await fetchInfo(ENDPOINTS.movie+params.movie);
    renderMovieDetails(movie);

    App.showHeader(false);
    App.showHome(false);
    App.showSearch(false);
    App.showMovieDetails(true);
  },
  bindEvents: () => {
    App.$.title.addEventListener("click", ()=>location.hash = "");
    App.$.searchButton.addEventListener("click", (e)=>{
      e.preventDefault();
      if(App.$.searchBar.value.trim() !== "") location.hash = `search=${App.$.searchBar.value.trim()}`;
    });
    App.$.viewMoreButton.addEventListener("click", ()=>location.hash = "trendings");
    App.$.backButton.addEventListener("click", ()=>history.back());
  },
  selecView: ()=>{
    window.scroll(0,0);
    navigator() === "home" ? App.renderHome() : 
    navigator() === "movie" ? App.renderMovie() : 
    navigator() === "search" ? App.renderSearch() :
    navigator() === "categorie" ? App.renderGenre() :
    navigator() === "trendings" ? App.renderTrending() : App.render404();
  },
  render: ()=>{
    App.selecView();
  },
  init: async ()=>{
    App.render();
    App.bindEvents();
    window.addEventListener("hashchange", ()=>App.render());
  }
} 

App.init();



// async function render() {
//   window.scroll(0,0);
//   if(navigator() === 'home') {
//     const movies = await fetchInfo(ENDPOINTS.trending);
//     const genres = await fetchInfo(ENDPOINTS.genres);
//     renderHomePage(movies.results, genres.genres);
//   } 
//   else if(navigator() === "movie") {
//     renderMovieDetails(await getMovie());
//   } 
//   else if(navigator() === "search") {
//     const  re = /=[a-zA-Z0-9]*$/g;
//     const searchQuery = location.hash.replace("#", "").match(re)[0].replace("=","");
//     const data = await fetchInfo(`${ENDPOINTS.queryMovie}`, {query: searchQuery});
//     renderSearch(data.results);
//   } 
//   else if(navigator() === "categorie") {
//     const  re = /=[a-zA-Z0-9]*$/g;
//     const searchQuery = location.hash.replace("#", "").match(re)[0].replace("=","");
//     const data = await fetchInfo(`${ENDPOINTS.queryFilterMovie}`, {with_genre: searchQuery});
//     renderSearch(data.results);
//   }
//   else if(navigator() === "trendings") {
//     const data = await fetchInfo(`${ENDPOINTS.trending}`);
//     renderTrendings(data.results);
//   }
// }

// async function renderFilters() {

//   const genres = await fetchInfo(ENDPOINTS.genres);

//   const genreList = document.querySelector(".genre-list");

//   const categoriesEL = genres.genres.map(genre => {
//     const genreContainer = document.createElement("option");

//     genreContainer.innerText = genre.name;
//     genreContainer.value = genre.id;

//     return genreContainer;
//   })

//   genreList.append(...categoriesEL);
// }

// async function bindAppEvents() {
//   const app = {
//     header: {
//       title: document.querySelector('.app-title'),
//       searchBar: document.querySelector(".search_bar"),
//       searchButton: document.querySelector(".search_button"),
//       filterButton: document.querySelector(".search_filter")
//     },
//     body: {
//       viewMoreButton: document.querySelector(".trending_view-more")
//     },
//     filter: {
//       applyButton: document.querySelector(".filter-apply"),
//       cancelButton: document.querySelector(".filter-cancel")
//     }
//   };


//   window.addEventListener('hashchange', async (e)=>{
//     await render();
//   });

//   app.header.title
//     .addEventListener('click', ()=>location.hash = "");

//   app.header.searchButton
//     .addEventListener('click', (e)=>{
//       e.preventDefault();
//       if(app.header.searchBar.value.trim() !== "") location.hash = `search=${app.header.searchBar.value.trim()}`;
//       app.header.searchBar.value = "";
//     });
    
//   app.body.viewMoreButton
//     .addEventListener('click', ()=>location.hash = "trendings");

//   app.header.filterButton
//     .addEventListener("click", async ()=>{
//       toggleFilters();
//     });

//   app.filter.applyButton
//     .addEventListener("click", ()=>{
//       toggleFilters();
//     })

//   app.filter.cancelButton
//   .addEventListener("click", ()=>{
//     toggleFilters();
//   })

//   document.querySelector(".movie .back_button")
//     .addEventListener("click", ()=>{history.back()});
// }

// async function app() {
//   await render();
//   await renderFilters();
//   await bindAppEvents();
// }

// app();