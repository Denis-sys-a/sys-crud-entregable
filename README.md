# Sistema CRUD de Peliculas

Este proyecto que implementa un CRUD completo de peliculas con arquitectura NestJS, TypeORM, MySQL en la parte del backend y en el frontend es estatico usando HTML,CSS,JS que incluye:

- **Catálogo** (listado, ordenamiento y acciones CRUD).
- **Formulario**(Para agregar y editar pelicula)
- **Detalle** (Para visualizar con mas claridad informacion de una pelicula)
- **Dashboard**(Con metricas; tablas de apoyo para ver los ultimos registrados,editados y mas antiguo; y poder ver graficos con Chart.js)

## Aruitectura:

### Backend

- **Framework:** NestJS.
- **Persistencia:** TypeORM contra MySQL.
- **Módulo principal:** `PeliculasModule` registra controller, service y repositorio concreto (`MySqlPeliculaRepository`) mediante token de inyección (`PELICULA_REPOSITORY`).

- **Configuracion global:**
  - `ValidationPipe` con `whitelist`, `transform` y `forbidNonWhitelisted`.

---

### Frontend

- Multipágina estática:
  - `dashboard.html`
  - `catalogo.html`
  - `formulario.html`
  - `details.html`
- JavaScript cliente centralizado en `public/app.js` y `public/details.js`.
- Dashboard con `Chart.js` para visualización de datos.

---

## Dashboard:

### Métricas implementadas

- Total de películas.
- Disponibles vs no disponibles.
- Género más frecuente.
- Duración promedio.
- Director más frecuente.

### Visualizaciones

- Barras: distribución por género.
- Dona: distribución por clasificación.
- Línea: lanzamientos por año.

### Tablas de apoyo

- Últimas registradas (por `id` descendente).
- Más antiguas por año.(Este es opcional a lo que se pidio en el trabajo).
- Última película editada (por `updatedAt`).

---

## Endpoints principales:

- `GET /api/peliculas`
- `GET /api/peliculas?orderBy=titulo|anio|duracion`
- `GET /api/peliculas/:id`
- `POST /api/peliculas`
- `PATCH /api/peliculas/:id`
- `DELETE /api/peliculas/:id`
- `POST /api/peliculas/upload`

---

## Configuraciones rapidas:

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear la base de datos ejecutando el script de:
   ```bash
   bd/bd_peliculas.sql
   ```
3. Crear un archivo `.env` en la raíz del proyecto:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=
   DB_NAME=bd_peliculas
   ```
4. Iniciar con el comando:
   ```bash
   npm run start:dev
   ```

En el navegador ingresar a la URL: `http://localhost:3000`

## Scripts útiles para la ejecucion del sistema

- `npm run start:dev` → modo desarrollo
- `npm run build` → compilar proyecto
- `npm test` → pruebas unitarias
