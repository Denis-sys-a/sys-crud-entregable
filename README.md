# Sistema CRUD de Peliculas

API REST construida con **NestJS + TypeORM + MySQL** para gestionar un simple catálogo de películas.

## Configuraciones rapidas:

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear la base de datos ejecutando:
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

## Endpoints principales:

- `GET /api/peliculas`
- `GET /api/peliculas?orderBy=titulo|anio|duracion`
- `GET /api/peliculas/:id`
- `POST /api/peliculas`
- `PATCH /api/peliculas/:id`
- `DELETE /api/peliculas/:id`
- `POST /api/peliculas/upload`

## La estructura del objeto película con un ejemplo:

```json
{
  "titulo": "Interstellar",
  "director": "Christopher Nolan",
  "genero": "Ciencia ficción",
  "anio": 2014,
  "duracionMin": 169,
  "clasificacion": "PG-13",
  "sinopsis": "...",
  "posterUrl": "/img/interstellar.jpg"
}
```

## Scripts útiles

- `npm run start:dev` → modo desarrollo
- `npm run build` → compilar proyecto
- `npm test` → pruebas unitarias
