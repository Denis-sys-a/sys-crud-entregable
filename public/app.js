const api = '/api/peliculas';

const form = document.getElementById('pelicula-form');
const tbody = document.getElementById('peliculas-body');
const total = document.getElementById('total');
const orderBy = document.getElementById('order-by');
const clearBtn = document.getElementById('clear-btn');
const posterFileInput = document.getElementById('posterFile');
const currentPosterElement = document.getElementById('current-poster');
const latestBody = document.getElementById('latest-body');
const oldestBody = document.getElementById('oldest-body');

const metricTotal = document.getElementById('metric-total');
const metricDirectors = document.getElementById('metric-directors');
const metricGenre = document.getElementById('metric-genre');
const metricDuration = document.getElementById('metric-duration');
const topDirectorsList = document.getElementById('top-directors');

let currentPosterUrl = '';
let chartGenre;
let chartClassification;
let chartTimeline;

function groupBy(list, key) {
  return list.reduce((acc, item) => {
    const value = item[key] || 'Sin dato';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

async function fetchPeliculas() {
  const query = orderBy && orderBy.value && orderBy.value !== 'id' ? `?orderBy=${orderBy.value}` : '';

  try {
    const response = await fetch(`${api}${query}`);
    if (!response.ok) {
      throw new Error('No se pudo cargar el catálogo');
    }

    const peliculas = await response.json();
    renderPeliculas(peliculas);
    renderDashboard(peliculas);
  } catch (_error) {
    renderPeliculas([]);
    renderDashboard([]);
  }
}

function renderPeliculas(peliculas) {
  if (!tbody || !total) {
    return;
  }

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

function renderDashboard(peliculas) {
  if (!metricTotal || !metricDirectors || !metricGenre || !metricDuration || !topDirectorsList) {
    return;
  }

  metricTotal.textContent = String(peliculas.length);

  const directorCounts = groupBy(peliculas, 'director');
  const sortedDirectors = Object.entries(directorCounts).sort((a, b) => b[1] - a[1]);
  metricDirectors.textContent = String(Object.keys(directorCounts).length);
  topDirectorsList.innerHTML = sortedDirectors
    .slice(0, 3)
    .map(([director, cantidad]) => `<li>${director}: ${cantidad}</li>`)
    .join('');

  const genreCounts = groupBy(peliculas, 'genero');
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
  metricGenre.textContent = topGenre ? `${topGenre[0]} (${topGenre[1]})` : '—';

  const avgDuration = peliculas.length
    ? Math.round(peliculas.reduce((sum, p) => sum + (p.duracionMin || 0), 0) / peliculas.length)
    : 0;
  metricDuration.textContent = `${avgDuration} min`;

  renderMiniTables(peliculas);
  renderCharts(genreCounts, groupBy(peliculas, 'clasificacion'), peliculas);
}

function renderMiniTables(peliculas) {
  if (!latestBody || !oldestBody) {
    return;
  }

  const latest = [...peliculas].sort((a, b) => b.id - a.id).slice(0, 5);
  const oldest = [...peliculas].sort((a, b) => a.anio - b.anio).slice(0, 5);

  latestBody.innerHTML = latest
    .map(
      (pelicula, index) =>
        `<tr><td>${index + 1}</td><td>${pelicula.titulo}</td><td>${pelicula.director}</td><td>${pelicula.genero}</td></tr>`,
    )
    .join('');

  oldestBody.innerHTML = oldest
    .map(
      (pelicula, index) =>
        `<tr><td>${index + 1}</td><td>${pelicula.titulo}</td><td>${pelicula.anio}</td><td>${pelicula.clasificacion}</td></tr>`,
    )
    .join('');
}

function buildTimeline(peliculas) {
  const grouped = peliculas.reduce((acc, pelicula) => {
    const year = String(pelicula.anio || 'Sin año');
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .reduce(
      (acc, [year, totalPeliculas]) => {
        acc.labels.push(year);
        acc.values.push(totalPeliculas);
        return acc;
      },
      { labels: [], values: [] },
    );
}

function renderCharts(genreCounts, classificationCounts, peliculas) {
  const genreCanvas = document.getElementById('genre-chart');
  const classificationCanvas = document.getElementById('classification-chart');
  const timelineCanvas = document.getElementById('timeline-chart');

  if (!genreCanvas || !classificationCanvas || !timelineCanvas || typeof Chart === 'undefined') {
    return;
  }

  const genreLabels = Object.keys(genreCounts);
  const genreValues = Object.values(genreCounts);
  const classLabels = Object.keys(classificationCounts);
  const classValues = Object.values(classificationCounts);
  const timeline = buildTimeline(peliculas);

  if (chartGenre) chartGenre.destroy();
  if (chartClassification) chartClassification.destroy();
  if (chartTimeline) chartTimeline.destroy();

  chartGenre = new Chart(genreCanvas, {
    type: 'bar',
    data: {
      labels: genreLabels,
      datasets: [{
        label: 'Películas por género',
        data: genreValues,
        backgroundColor: '#2d5b88',
        borderRadius: 6,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  chartClassification = new Chart(classificationCanvas, {
    type: 'doughnut',
    data: {
      labels: classLabels,
      datasets: [{
        label: 'Clasificación',
        data: classValues,
        backgroundColor: ['#244e75', '#8a1538', '#5f2a7f', '#71717a', '#0f766e'],
      }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  chartTimeline = new Chart(timelineCanvas, {
    type: 'line',
    data: {
      labels: timeline.labels,
      datasets: [{
        label: 'Lanzamientos por año',
        data: timeline.values,
        borderColor: '#6d3ab3',
        backgroundColor: 'rgba(109,58,179,0.12)',
        tension: 0.35,
        fill: true,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

function renderCurrentPosterInfo() {
  if (!currentPosterElement) {
    return;
  }

  currentPosterElement.textContent = currentPosterUrl ? `Imagen actual: ${currentPosterUrl}` : '';
}

async function uploadPosterIfNeeded() {
  if (!posterFileInput) {
    return currentPosterUrl || undefined;
  }

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
  if (!form) {
    return;
  }

  document.getElementById('pelicula-id').value = pelicula.id;
  document.getElementById('titulo').value = pelicula.titulo;
  document.getElementById('director').value = pelicula.director;
  document.getElementById('genero').value = pelicula.genero;
  document.getElementById('anio').value = pelicula.anio;
  document.getElementById('duracionMin').value = pelicula.duracionMin;
  document.getElementById('clasificacion').value = pelicula.clasificacion;
  document.getElementById('sinopsis').value = pelicula.sinopsis;

  if (posterFileInput) {
    posterFileInput.value = '';
  }

  currentPosterUrl = pelicula.posterUrl || '';
  renderCurrentPosterInfo();
  document.getElementById('submit-btn').textContent = 'Actualizar película';
}

function resetForm() {
  if (!form) {
    return;
  }

  form.reset();
  document.getElementById('pelicula-id').value = '';
  
  if (posterFileInput) {
    posterFileInput.value = '';
  }

  currentPosterUrl = '';
  renderCurrentPosterInfo();
  document.getElementById('submit-btn').textContent = 'Guardar película';
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('pelicula-id').value;

    try {
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
      alert('Película guardada correctamente.');
    } catch (_error) {
      alert('No se pudo guardar la película. Revisa el formato de la imagen.');
    }
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    resetForm();
  });
}

if (tbody) {
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
      window.location.href = `/formulario.html?id=${id}`;
    }
    
    if (action === 'view') {
      window.location.href = `/details.html?id=${id}`;
    }
  });
}

if (orderBy) {
  orderBy.addEventListener('change', fetchPeliculas);
}

async function loadMovieForEditIfNeeded() {
  if (!form) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    return;
  }

  try {
    const response = await fetch(`${api}/${id}`);
    if (!response.ok) {
      return;
    }

    const pelicula = await response.json();
    fillForm(pelicula);
  } catch (_error) {
    // No-op
  }
}

renderCurrentPosterInfo();
fetchPeliculas();
loadMovieForEditIfNeeded();