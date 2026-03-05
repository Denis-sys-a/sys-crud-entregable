const api = '/api/peliculas';
const form = document.getElementById('pelicula-form');
const tbody = document.getElementById('peliculas-body');
const total = document.getElementById('total');
const orderBy = document.getElementById('order-by');
const clearBtn = document.getElementById('clear-btn');
const posterFileInput = document.getElementById('posterFile');
const currentPosterElement = document.getElementById('current-poster');

let currentPosterUrl = '';

async function fetchPeliculas() {
  const query = orderBy.value && orderBy.value !== 'id' ? `?orderBy=${orderBy.value}` : '';
  const response = await fetch(`${api}${query}`);
  const peliculas = await response.json();
  renderPeliculas(peliculas);
}

function renderPeliculas(peliculas) {
  total.textContent = peliculas.length;
  tbody.innerHTML = '';

  peliculas.forEach((pelicula, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${pelicula.titulo}</td>
      <td>${pelicula.director}</td>
      <td>${pelicula.genero}</td>
      <td>${pelicula.anio}</td>
      <td>${pelicula.duracionMin} min</td>
      <td>${pelicula.clasificacion}</td>
      <td>
        <div class="actions">
          <button class="btn btn-view" data-action="view" data-id="${pelicula.id}" titulo="Ver detalles">👀</button>
          <button class="btn btn-edit" data-action="edit" data-id="${pelicula.id}" titulo="Editar">🖊️</button>
          <button class="btn btn-delete" data-action="delete" data-id="${pelicula.id}" titulo="Eliminar">🗑️</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function renderCurrentPosterInfo() {
  if (currentPosterUrl) {
    currentPosterElement.textContent = `Imagen actual: ${currentPosterUrl}`;
    return;
  }

  currentPosterElement.textContent = '';
}

async function uploadPosterIfNeeded() {
  const posterFile = posterFileInput.files[0];

  if (!posterFile) {
    return currentPosterUrl || undefined;
  }

  const formData = new FormData();
  formData.append('poster', posterFile);

  const response = await fetch(`${api}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('No se pudo subir la imagen del cartel.');
  }

  const data = await response.json();
  return data.posterUrl;
}

async function getPayload() {
  const posterUrl = await uploadPosterIfNeeded();

  return {
    titulo: document.getElementById('titulo').value,
    director: document.getElementById('director').value,
    genero: document.getElementById('genero').value,
    anio: Number(document.getElementById('anio').value),
    duracionMin: Number(document.getElementById('duracionMin').value),
    clasificacion: document.getElementById('clasificacion').value,
    sinopsis: document.getElementById('sinopsis').value,
    posterUrl,
  };
}

function fillForm(pelicula) {
  document.getElementById('pelicula-id').value = pelicula.id;
  document.getElementById('titulo').value = pelicula.titulo;
  document.getElementById('director').value = pelicula.director;
  document.getElementById('genero').value = pelicula.genero;
  document.getElementById('anio').value = pelicula.anio;
  document.getElementById('duracionMin').value = pelicula.duracionMin;
  document.getElementById('clasificacion').value = pelicula.clasificacion;
  document.getElementById('sinopsis').value = pelicula.sinopsis;
  posterFileInput.value = '';
  currentPosterUrl = pelicula.posterUrl || '';
  renderCurrentPosterInfo();
  document.getElementById('submit-btn').textContent = 'Actualizar película';
}

function resetForm() {
  form.reset();
  document.getElementById('pelicula-id').value = '';
  posterFileInput.value = '';
  currentPosterUrl = '';
  renderCurrentPosterInfo();
  document.getElementById('submit-btn').textContent = 'Guardar película';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('pelicula-id').value;

  try{
    const payload = await getPayload();

    if (id) {
      await fetch(`${api}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  }

  resetForm();
  fetchPeliculas();
  } catch (error) {
    alert('No se pudo guardar la película. Revisa el formato de la imagen.');
  }
});

clearBtn.addEventListener('click', () => {
  resetForm();
});

tbody.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'delete') {
    const shouldDelete = window.confirm(
      '¿Seguro que deseas eliminar esta película?\n\nPresiona "Aceptar" para eliminar o "Cancelar" para mantenerla.',
    );

    if (!shouldDelete) {
      return;
    }

    await fetch(`${api}/${id}`, { method: 'DELETE' });
    fetchPeliculas();
  }

  if (action === 'edit') {
    const response = await fetch(`${api}/${id}`);
    const pelicula = await response.json();
    fillForm(pelicula);
  }

  if (action === 'view') {
    window.location.href = `/details.html?id=${id}`;
  }
});

orderBy.addEventListener('change', fetchPeliculas);

renderCurrentPosterInfo();
fetchPeliculas();