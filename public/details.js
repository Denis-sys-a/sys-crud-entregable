const api = '/api/peliculas';
const detailsInfo = document.getElementById('details-info');
const detailsPoster = document.getElementById('details-poster');

function getPeliculaIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderPelicula(pelicula) {
  detailsInfo.innerHTML = `
    <p><strong>Título:</strong> ${pelicula.title}</p>
    <p><strong>Director:</strong> ${pelicula.director}</p>
    <p><strong>Género:</strong> ${pelicula.genre}</p>
    <p><strong>Año:</strong> ${pelicula.year}</p>
    <p><strong>Duración:</strong> ${pelicula.durationMin} min</p>
    <p><strong>Clasificación:</strong> ${pelicula.classification}</p>
    <p><strong>Sinopsis:</strong> ${pelicula.synopsis}</p>
  `;

  detailsPoster.src = pelicula.posterUrl || 'https://via.placeholder.com/280x420?text=Sin+poster';
}

async function loadPelicula() {
  const id = getPeliculaIdFromQuery();
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
    const pelicula = await response.json();
    renderPelicula(pelicula);
  } catch (error) {
    detailsInfo.innerHTML = '<p>No se pudo cargar la información de la película.</p>';
    detailsPoster.style.display = 'none';
  }
}

loadPelicula();