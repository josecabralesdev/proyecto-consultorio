-- =============================================
-- SISTEMA DE GESTIÓN DE CONSULTORIOS MÉDICOS
-- Script de Base de Datos
-- =============================================

-- Crear base de datos
-- CREATE DATABASE consultorios_familiares;

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Tabla de Provincias
CREATE TABLE IF NOT EXISTS PROVINCIAS (
    id_provincia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Municipios
CREATE TABLE IF NOT EXISTS MUNICIPIOS (
    id_municipio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_provincia INTEGER NOT NULL REFERENCES PROVINCIAS (id_provincia) ON DELETE CASCADE
);

-- Tabla de Policlinicos
CREATE TABLE IF NOT EXISTS POLICLINICOS (
    id_policlinico SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_municipio INTEGER NOT NULL REFERENCES MUNICIPIOS (id_municipio) ON DELETE CASCADE
);

-- Tabla de Consultorios
CREATE TABLE IF NOT EXISTS CONSULTORIOS (
    id_consultorio SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL,
    id_policlinico INTEGER NOT NULL REFERENCES POLICLINICOS (id_policlinico) ON DELETE CASCADE
);

-- Tabla para los Médicos
CREATE TABLE IF NOT EXISTS MEDICOS (
    id_medico SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS (id_consultorio) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Administradores
CREATE TABLE IF NOT EXISTS ADMINISTRADORES (
    id_admin SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Niveles Escolares
CREATE TABLE IF NOT EXISTS NIVELES_ESCOLARES (
    id_nivel SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Ocupaciones
CREATE TABLE IF NOT EXISTS OCUPACIONES (
    id_ocupacion SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Grupos Dispensariales
CREATE TABLE IF NOT EXISTS GRUPOS_DISPENSARIALES (
    id_grupo SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Sexos
CREATE TABLE IF NOT EXISTS SEXOS (
    id_sexo SERIAL PRIMARY KEY,
    codigo CHAR(1) NOT NULL UNIQUE,
    descripcion VARCHAR(20) NOT NULL
);

-- Tabla de Colores de Piel
CREATE TABLE IF NOT EXISTS COLORES_PIEL (
    id_color SERIAL PRIMARY KEY,
    codigo CHAR(1) NOT NULL UNIQUE,
    descripcion VARCHAR(50) NOT NULL
);

-- Tabla de Áreas Geográficas
CREATE TABLE IF NOT EXISTS AREAS_GEOGRAFICAS (
    id_area SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS (id_consultorio) ON DELETE CASCADE
);

-- Tabla de Pacientes
CREATE TABLE IF NOT EXISTS PACIENTES (
    id_paciente SERIAL PRIMARY KEY,
    numero_historia_clinica INTEGER NOT NULL,
    nombre_apellidos VARCHAR(255) NOT NULL,
    carnet_identidad VARCHAR(20) UNIQUE,
    sexo CHAR(1),
    direccion INTEGER,
    id_area_geografica INTEGER REFERENCES AREAS_GEOGRAFICAS (id_area),
    id_nivel_escolar INTEGER REFERENCES NIVELES_ESCOLARES (id_nivel),
    id_ocupacion INTEGER REFERENCES OCUPACIONES (id_ocupacion),
    id_grupo_dispensarial INTEGER REFERENCES GRUPOS_DISPENSARIALES (id_grupo),
    id_color_piel INTEGER REFERENCES COLORES_PIEL (id_color),
    problemas_salud TEXT,
    observaciones TEXT,
    id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS (id_consultorio) ON DELETE CASCADE
);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Provincia
INSERT INTO
    PROVINCIAS (nombre)
VALUES ('Ciego de Avila')
ON CONFLICT DO NOTHING;

-- Municipio
INSERT INTO
    MUNICIPIOS (nombre, id_provincia)
VALUES ('Ciego de Avila', 1)
ON CONFLICT DO NOTHING;

-- Policlinicos
INSERT INTO
    POLICLINICOS (nombre, id_municipio)
VALUES ('Norte', 1),
    ('Sur', 1),
    ('Centro', 1),
    ('Belkis Sotomayor', 1),
    ('Ceballos', 1)
ON CONFLICT DO NOTHING;

-- Consultorios
INSERT INTO
    CONSULTORIOS (numero, id_policlinico)
VALUES ('1', 1),
    ('2', 1),
    ('3', 1),
    ('1', 2),
    ('2', 2),
    ('3', 2),
    ('1', 3),
    ('2', 3),
    ('3', 3),
    ('1', 4),
    ('2', 4),
    ('3', 4),
    ('1', 5),
    ('2', 5),
    ('3', 5)
ON CONFLICT DO NOTHING;

-- Niveles Escolares
INSERT INTO
    NIVELES_ESCOLARES (descripcion)
VALUES ('Primario'),
    ('Secundario'),
    ('Universitario'),
    ('Postgrado')
ON CONFLICT DO NOTHING;

-- Ocupaciones
INSERT INTO
    OCUPACIONES (descripcion)
VALUES ('Estudiante'),
    ('Maestro'),
    ('Ingeniero'),
    ('Médico'),
    ('Jubilado')
ON CONFLICT DO NOTHING;

-- Grupos Dispensariales
INSERT INTO
    GRUPOS_DISPENSARIALES (descripcion)
VALUES ('I'),
    ('II'),
    ('III'),
    ('IV')
ON CONFLICT DO NOTHING;

-- Sexos
INSERT INTO
    SEXOS (codigo, descripcion)
VALUES ('M', 'Masculino'),
    ('F', 'Femenino'),
    ('N', 'No especificado')
ON CONFLICT DO NOTHING;

-- Colores de Piel
INSERT INTO
    COLORES_PIEL (codigo, descripcion)
VALUES ('B', 'Blanco'),
    ('M', 'Mestizo'),
    ('N', 'Negro')
ON CONFLICT DO NOTHING;

-- =============================================
-- FIN DEL SCRIPT
-- =============================================