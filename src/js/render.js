function renderMovies(movies, container) {
  container.innerHTML = '';

  const movieEL = movies.map(movie => {
    const movieContainer = document.createElement("div");
    const movieImage = document.createElement("img");
    const movieInformation = document.createElement("div");
    const movieTitle = document.createElement("p");
    const movieReleaseDate = document.createElement("p");

    movieContainer.classList.add('movie');
    movieImage.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    movieTitle.innerText = movie.original_title;

    movieTitle.classList.add("movie_title");
    movieReleaseDate.innerText = dayjs(movie.release_date).format("MMM DD YYYY");
    movieReleaseDate.classList.add("movie_release-date")

    movieInformation.append(movieTitle, movieReleaseDate)

    movieContainer.append(movieImage, movieInformation);

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

function renderMovieDetails(movie) {
  const movieEL = {
    banner: document.querySelector(".movie_banner"),
    title: document.querySelector(".movie-details .movie_title"),
    rating: document.querySelector(".movie_rating"),
    overview: document.querySelector(".movie_overview")
  }
  
  movieEL.banner.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
  movieEL.title.innerText = `${movie.original_title} (${movie.release_date.slice(0,4)})`;
  movieEL.rating.innerText = movie.vote_average.toFixed(1)+ ` ⭐`;
  movieEL.overview.innerText = movie.overview;
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

export { renderMovies, renderSearch, renderMovieDetails};