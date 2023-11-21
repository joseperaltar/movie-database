import { fetchInfo } from "./js/apiHandler.js";
import { renderTrendingMoviesPreview, renderCategories } from "./js/render.js";

const ENDPOINTS = {
  trending: "/trending/movie/day",
  genres: "/genre/movie/list"
}

async function app() {
  const movies = await fetchInfo(ENDPOINTS.trending);
  const genres = await fetchInfo(ENDPOINTS.genres);
  renderTrendingMoviesPreview(movies.results);
  renderCategories(genres.genres);
}

app();