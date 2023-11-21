function renderTrendingMoviesPreview(movies) {
  const movieEL = movies.map(movie => {
    const movieContainer = document.createElement("div");
    const movieImage = document.createElement("img");

    movieContainer.classList.add('movie-container');
    movieImage.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`

    movieContainer.append(movieImage);
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
    return genreContainer;
  })

  document.querySelector(".categories_list").append(...categoriesEL);
}

export { renderTrendingMoviesPreview, renderCategories };