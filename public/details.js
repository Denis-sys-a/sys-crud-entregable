const api = '/api/movies';
const detailsInfo = document.getElementById('details-info');
const detailsPoster = document.getElementById('details-poster');

function getMovieIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderMovie(movie) {
  detailsInfo.innerHTML = `
    <p><strong>Título:</strong> ${movie.title}</p>
    <p><strong>Director:</strong> ${movie.director}</p>
    <p><strong>Género:</strong> ${movie.genre}</p>
    <p><strong>Año:</strong> ${movie.year}</p>
    <p><strong>Duración:</strong> ${movie.durationMin} min</p>
    <p><strong>Clasificación:</strong> ${movie.classification}</p>
    <p><strong>Sinopsis:</strong> ${movie.synopsis}</p>
  `;

  detailsPoster.src = movie.posterUrl || 'https://via.placeholder.com/280x420?text=Sin+poster';
}

async function loadMovie() {
  const id = getMovieIdFromQuery();
  if (!id) {
    detailsInfo.innerHTML = '<p>No se encontró el id de la película.</p>';
    detailsPoster.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`${api}/${id}`);
    if (!response.ok) {
      throw new Error('No se pudo cargar la película');
    }
    const movie = await response.json();
    renderMovie(movie);
  } catch (error) {
    detailsInfo.innerHTML = '<p>No se pudo cargar la información de la película.</p>';
    detailsPoster.style.display = 'none';
  }
}

loadMovie();