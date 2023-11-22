function renderHeader() {
  document.querySelector(".app-header").classList.remove("inactive");
}

function renderTrendingMoviesPreview(movies) {
  const movieEL = movies.map(movie => {
    const movieContainer = document.createElement("div");
    const movieImage = document.createElement("img");

    movieContainer.classList.add('movie-container');
    movieImage.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`

    movieContainer.append(movieImage);

    movieImage.addEventListener("click", ()=> location.hash = `movie=${movie.id}`);

    return movieContainer;
  });

  document.querySelector(".trending_list").append(...movieEL);
}

function renderCategories(genres) {
  const categoriesEL = genres.map(genre => {
    const genreContainer = document.createElement("div");
    const genreTitle = document.createElement("p");

    genreContainer.classList.add('categorie-container');
    genreTitle.innerText = genre.name;

    genreContainer.append(genreTitle);

    genreContainer.addEventListener("click", ()=> location.hash = `categorie=${genre.name}`)
    return genreContainer;
  })

  document.querySelector(".categories_list").append(...categoriesEL);
}


function renderMovie(movie) {
  const movieEL = {
    banner: document.querySelector(".banner_image"),
    poster: document.querySelector(".movie_poster"),
    title: document.querySelector(".movie_title"),
    rating: document.querySelector(".movie_rating"),
    release_date: document.querySelector(".movie_release-date"),
    duration: document.querySelector(".movie_duration"),
    genres: document.querySelector(".movie_genres"),
    overview: document.querySelector(".movie_overview")
  }
  
  movieEL.banner.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
  movieEL.title.innerText = `${movie.original_title} (${movie.release_date.slice(0,4)})`;
  movieEL.rating.innerText = movie.vote_average.toFixed(1)+ ` ⭐`;
  movieEL.duration.innerText = movie.runtime;
  movie.genres.forEach(genre => {
    let element = document.createElement('p');
    element.innerText = genre.name;
    element.classList.add('genre');
    movieEL.genres.append(element);
  });
  movieEL.overview.innerText = movie.overview;

  document.querySelector(".trending").classList.add('inactive');
  document.querySelector(".categories").classList.add('inactive');
  document.querySelector(".movie").classList.remove('inactive');
  document.querySelector(".app-header").classList.add("inactive");
}

function renderHomePage(movies, genres) {
  if(document.querySelector(".trending").classList.contains('inactive')) {
    document.querySelector(".trending").classList.remove('inactive');
    document.querySelector(".categories").classList.remove('inactive');
    document.querySelector(".app-header").classList.remove("inactive");
  } else {
    renderHeader();
    renderTrendingMoviesPreview(movies);
    renderCategories(genres);
  }
  document.querySelector(".movie").classList.add('inactive');
}

export { renderHomePage, renderMovie };