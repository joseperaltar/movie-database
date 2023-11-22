function renderMovies(movies, container) {
  container.innerHTML = '';

  const movieEL = movies.map(movie => {
    const movieContainer = document.createElement("div");
    const movieImage = document.createElement("img");

    movieContainer.classList.add('movie-container');
    movieImage.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`

    movieContainer.append(movieImage);

    movieImage.dataset.id = movie.id;
    return movieContainer;
  });

  container.addEventListener("click", (e)=>{
    if(e.target.tagName === "IMG") {
      location.hash = `movie=${e.target.dataset.id}`;
    }
  })
  container.append(...movieEL);
}

function renderTrendingMoviesPreview(movies) {
  let trendingList = document.querySelector(".trending_list");
  renderMovies(movies, trendingList);
}

function renderCategories(genres, categoriesList = document.querySelector(".categories_list")) {

  categoriesList.innerHTML = "";

  const categoriesEL = genres.map(genre => {
    const genreContainer = document.createElement("div");
    const genreTitle = document.createElement("p");

    genreContainer.classList.add('categorie-container');
    genreTitle.innerText = genre.name;

    genreContainer.append(genreTitle);

    genreContainer.addEventListener("click", ()=> location.hash = `categorie=${genre.id}`)
    return genreContainer;
  })

  categoriesList.append(...categoriesEL);
}

function toggleFilters() {

  const modal = document.querySelector(".filter-modal");

  modal.classList.contains("inactive") ? 
    modal.classList.remove("inactive"):
    modal.classList.add("inactive");
}

function renderMovieDetails(movie) {
  const movieEL = {
    banner: document.querySelector(".banner_image"),
    poster: document.querySelector(".movie_poster"),
    title: document.querySelector(".movie_title"),
    rating: document.querySelector(".movie_rating"),
    release_date: document.querySelector(".movie_release-date"),
    genres: document.querySelector(".movie_genres"),
    overview: document.querySelector(".movie_overview")
  }
  
  movieEL.banner.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
  movieEL.title.innerText = `${movie.original_title} (${movie.release_date.slice(0,4)})`;
  movieEL.rating.innerText = movie.vote_average.toFixed(1)+ ` ⭐`;
  movieEL.overview.innerText = movie.overview;
  movie.genres.forEach(genre => {
    let element = document.createElement('p');
    element.innerText = genre.name;
    element.classList.add('genre');
    movieEL.genres.append(element);
  });

  document.querySelector(".trending").classList.add('inactive');
  document.querySelector(".categories").classList.add('inactive');
  document.querySelector(".movie").classList.remove('inactive');
  document.querySelector(".app-header").classList.add("inactive");
  document.querySelector(".search-result").classList.add('inactive');
  document.querySelector(".trending_result").classList.add('inactive');
}

function renderHomePage(movies, genres) {
  document.querySelector(".trending").classList.remove('inactive');
  document.querySelector(".categories").classList.remove('inactive');
  document.querySelector(".app-header").classList.remove("inactive");
  document.querySelector(".movie").classList.add('inactive');
  document.querySelector(".search-result").classList.add('inactive');
  document.querySelector(".trending_result").classList.add('inactive');

  renderTrendingMoviesPreview(movies);
  renderCategories(genres);
}

function renderSearch(movies) {
  let movieList = document.querySelector(".search_wrapper .movie-list");
  movieList.innerHTML = "";
  document.querySelector(".search_wrapper .error").classList.add("inactive");
  movies.length !== 0 ? 
    renderMovies(movies, movieList):
    document.querySelector(".search_wrapper .error").classList.remove("inactive");

  
  document.querySelector(".app-header").classList.remove("inactive");
  document.querySelector(".trending").classList.add('inactive');
  document.querySelector(".categories").classList.add('inactive');
  document.querySelector(".search-result").classList.remove('inactive');
  document.querySelector(".movie").classList.add('inactive');
}

function renderTrendings(movies) {
  let movieList = document.querySelector(".trending_wrapper .movie-list");
  renderMovies(movies, movieList);

  document.querySelector(".trending_result").classList.remove("inactive");
  document.querySelector(".app-header").classList.remove("inactive");
  document.querySelector(".trending").classList.add('inactive');
  document.querySelector(".categories").classList.add('inactive');
  document.querySelector(".search-result").classList.remove('inactive');
  document.querySelector(".movie").classList.add('inactive');
}

export { renderHomePage, renderMovieDetails, renderSearch, renderTrendings, toggleFilters };