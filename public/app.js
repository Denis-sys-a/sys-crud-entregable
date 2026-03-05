const api = '/api/movies';
const form = document.getElementById('movie-form');
const tbody = document.getElementById('movies-body');
const total = document.getElementById('total');
const orderBy = document.getElementById('order-by');
const clearBtn = document.getElementById('clear-btn');

async function fetchMovies() {
  const query = orderBy.value && orderBy.value !== 'id' ? `?orderBy=${orderBy.value}` : '';
  const response = await fetch(`${api}${query}`);
  const movies = await response.json();
  renderMovies(movies);
}

function renderMovies(movies) {
  total.textContent = movies.length;
  tbody.innerHTML = '';

  movies.forEach((movie, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${movie.title}</td>
      <td>${movie.director}</td>
      <td>${movie.genre}</td>
      <td>${movie.year}</td>
      <td>${movie.durationMin} min</td>
      <td>${movie.classification}</td>
      <td>
        <div class="actions">
          <button class="btn btn-view" data-action="view" data-id="${movie.id}" title="Ver detalles">👀</button>
          <button class="btn btn-edit" data-action="edit" data-id="${movie.id}" title="Editar">🖊️</button>
          <button class="btn btn-delete" data-action="delete" data-id="${movie.id}" title="Eliminar">🗑️</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function getPayload() {
  return {
    title: document.getElementById('title').value,
    director: document.getElementById('director').value,
    genre: document.getElementById('genre').value,
    year: Number(document.getElementById('year').value),
    durationMin: Number(document.getElementById('durationMin').value),
    classification: document.getElementById('classification').value,
    synopsis: document.getElementById('synopsis').value,
    posterUrl: document.getElementById('posterUrl').value || undefined,
  };
}

function fillForm(movie) {
  document.getElementById('movie-id').value = movie.id;
  document.getElementById('title').value = movie.title;
  document.getElementById('director').value = movie.director;
  document.getElementById('genre').value = movie.genre;
  document.getElementById('year').value = movie.year;
  document.getElementById('durationMin').value = movie.durationMin;
  document.getElementById('classification').value = movie.classification;
  document.getElementById('synopsis').value = movie.synopsis;
  document.getElementById('posterUrl').value = movie.posterUrl || '';
  document.getElementById('submit-btn').textContent = 'Actualizar película';
}

function resetForm() {
  form.reset();
  document.getElementById('movie-id').value = '';
  document.getElementById('submit-btn').textContent = 'Guardar película';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('movie-id').value;
  const payload = getPayload();

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
  fetchMovies();
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
    fetchMovies();
  }

  if (action === 'edit') {
    const response = await fetch(`${api}/${id}`);
    const movie = await response.json();
    fillForm(movie);
  }

  if (action === 'view') {
    window.location.href = `/details.html?id=${id}`;
  }
});

orderBy.addEventListener('change', fetchMovies);

fetchMovies();