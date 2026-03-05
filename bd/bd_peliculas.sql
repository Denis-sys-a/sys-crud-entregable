-- Ejecuta este script en MySQL Workbench
CREATE DATABASE IF NOT EXISTS bd_peliculas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bd_peliculas;

CREATE TABLE IF NOT EXISTS peliculas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  director VARCHAR(255) NOT NULL,
  genero VARCHAR(120) NOT NULL,
  anio INT NOT NULL,
  duracion_min INT NOT NULL,
  clasificacion ENUM('G', 'PG', 'PG-13', 'R', 'NC-17') NOT NULL,
  sinopsis TEXT NOT NULL,
  poster_data LONGTEXT NULL,
  poster_mime_type VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);