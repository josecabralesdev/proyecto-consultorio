# 🏥 Sistema de Gestión de Consultorios Médicos

Sistema web completo para la gestión de pacientes en consultorios médicos familiares. Permite a los médicos registrar, actualizar y consultar información de sus pacientes, mientras que los administradores pueden gestionar la estructura organizacional (provincias, municipios, policlínicos y consultorios).

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)
![Express](https://img.shields.io/badge/Express-4.x-black?logo=express)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [Variables de Entorno](#-variables-de-entorno)
- [Ejecución](#-ejecución)
- [Credenciales por Defecto](#-credenciales-por-defecto)
- [API Endpoints](#-api-endpoints)
- [Contribución](#-contribución)

---

## ✨ Características

### 👨‍⚕️ Portal de Médicos
- ✅ Registro e inicio de sesión seguro con JWT
- ✅ Dashboard con estadísticas de pacientes
- ✅ CRUD completo de pacientes
- ✅ Búsqueda de pacientes por nombre, carnet o número de historia clínica
- ✅ Gestión de áreas geográficas del consultorio
- ✅ Gestión de ocupaciones
- ✅ Vista detallada de cada paciente

### 🛡️ Portal de Administración
- ✅ Panel de control con estadísticas generales
- ✅ Gestión de Provincias (CRUD)
- ✅ Gestión de Municipios (CRUD)
- ✅ Gestión de Policlínicos (CRUD)
- ✅ Gestión de Consultorios (CRUD)
- ✅ Protección de eliminación en cascada

### 🔐 Seguridad
- ✅ Autenticación mediante JSON Web Tokens (JWT)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Rutas protegidas en frontend y backend
- ✅ Separación de roles (Médico/Administrador)

---

## 🛠 Tecnologías

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | 18.x | Entorno de ejecución |
| Express | 4.18.x | Framework web |
| PostgreSQL | 15.x | Base de datos relacional |
| pg | 8.11.x | Cliente PostgreSQL para Node.js |
| bcryptjs | 2.4.x | Encriptación de contraseñas |
| jsonwebtoken | 9.x | Autenticación JWT |
| cors | 2.8.x | Middleware CORS |
| dotenv | 16.x | Variables de entorno |

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 18.2.x | Biblioteca UI |
| Vite | 5.x | Build tool |
| React Router | 6.x | Enrutamiento |
| TailwindCSS | 3.3.x | Framework CSS |
| Axios | 1.6.x | Cliente HTTP |
| React Hot Toast | 2.4.x | Notificaciones |
| React Icons | 4.12.x | Iconos |

---

## 📁 Estructura del Proyecto

consultorio-medico/
├── 📂 backend/
│ ├── 📂 config/
│ │ └── db.js # Configuración de PostgreSQL
│ ├── 📂 controllers/
│ │ ├── adminAuthController.js
│ │ ├── authController.js
│ │ ├── catalogosController.js
│ │ ├── pacientesController.js
│ │ └── ubicacionesController.js
│ ├── 📂 middleware/
│ │ ├── adminAuth.js # Middleware auth admin
│ │ └── auth.js # Middleware auth médicos
│ ├── 📂 routes/
│ │ ├── admin.js
│ │ ├── auth.js
│ │ ├── catalogos.js
│ │ └── pacientes.js
│ ├── 📂 scripts/
│ │ └── createAdmin.js # Script para crear admin
│ ├── .env # Variables de entorno
│ ├── package.json
│ └── server.js # Punto de entrada
│
├── 📂 frontend/
│ ├── 📂 src/
│ │ ├── 📂 components/
│ │ │ ├── 📂 admin/
│ │ │ │ ├── AdminDashboard.jsx
│ │ │ │ ├── AdminLogin.jsx
│ │ │ │ ├── AdminNavbar.jsx
│ │ │ │ ├── AdminProtectedRoute.jsx
│ │ │ │ ├── ConsultoriosManager.jsx
│ │ │ │ ├── MunicipiosManager.jsx
│ │ │ │ ├── PoliclinicosManager.jsx
│ │ │ │ └── ProvinciasManager.jsx
│ │ │ ├── CatalogManager.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Navbar.jsx
│ │ │ ├── PatientForm.jsx
│ │ │ ├── PatientList.jsx
│ │ │ ├── ProtectedRoute.jsx
│ │ │ └── Register.jsx
│ │ ├── 📂 context/
│ │ │ ├── AdminContext.jsx
│ │ │ └── AuthContext.jsx
│ │ ├── 📂 services/
│ │ │ └── api.js # Configuración Axios
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ ├── index.html
│ ├── package.json
│ ├── postcss.config.js
│ ├── tailwind.config.js
│ └── vite.config.js
│
├── 📄 README.md


---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18.0.0 o superior) - [Descargar](https://nodejs.org/)
- **PostgreSQL** (v13.0 o superior) - [Descargar](https://www.postgresql.org/download/)
- **npm** o **yarn** (incluido con Node.js)
- **Git** (opcional) - [Descargar](https://git-scm.com/)

### Verificar instalación

```bash
node --version    # Debería mostrar v18.x.x o superior
npm --version     # Debería mostrar 9.x.x o superior
psql --version    # Debería mostrar psql 13.x o superior
```

---

## 🚀 Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/josecabralesdev/proyecto-consultorio.git
cd consultorio-medico
```

2. Instalar dependencias del Backend

```bash
cd backend
pnpm install
```

3. Instalar dependencias del Frontend

```bash
cd ../frontend
pnpm install
```

---

## 🗄 Configuración de Base de Datos

1. Crear la base de datos

Conéctate a PostgreSQL y ejecuta:

```sql
-- Crear la base de datos
CREATE DATABASE consultorios_familiares;

-- Conectar a la base de datos
\c consultorios_familiares
```

2. Crear las tablas

Ejecuta el siguiente script SQL:

```sql
-- Tabla de Provincias
CREATE TABLE PROVINCIAS (
    id_provincia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Municipios
CREATE TABLE MUNICIPIOS (
    id_municipio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_provincia INTEGER NOT NULL REFERENCES PROVINCIAS(id_provincia) ON DELETE CASCADE
);

-- Tabla de Policlinicos
CREATE TABLE POLICLINICOS (
    id_policlinico SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_municipio INTEGER NOT NULL REFERENCES MUNICIPIOS(id_municipio) ON DELETE CASCADE
);

-- Tabla de Consultorios
CREATE TABLE CONSULTORIOS (
    id_consultorio SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL,
    id_policlinico INTEGER NOT NULL REFERENCES POLICLINICOS(id_policlinico) ON DELETE CASCADE
);

-- Tabla para los Médicos (para el login)
CREATE TABLE MEDICOS (
    id_medico SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS(id_consultorio) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Administradores
CREATE TABLE ADMINISTRADORES (
    id_admin SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Niveles Escolares
CREATE TABLE NIVELES_ESCOLARES (
    id_nivel SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Ocupaciones
CREATE TABLE OCUPACIONES (
    id_ocupacion SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Grupos Dispensariales
CREATE TABLE GRUPOS_DISPENSARIALES (
    id_grupo SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Sexos
CREATE TABLE SEXOS (
    id_sexo SERIAL PRIMARY KEY,
    codigo CHAR(1) NOT NULL UNIQUE,
    descripcion VARCHAR(20) NOT NULL
);

-- Tabla de Colores de Piel
CREATE TABLE COLORES_PIEL (
    id_color SERIAL PRIMARY KEY,
    codigo CHAR(1) NOT NULL UNIQUE,
    descripcion VARCHAR(50) NOT NULL
);

-- Tabla de Áreas Geográficas
CREATE TABLE AREAS_GEOGRAFICAS (
    id_area SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS(id_consultorio) ON DELETE CASCADE
);

-- Tabla de Pacientes
CREATE TABLE PACIENTES (
    id_paciente SERIAL PRIMARY KEY,
    numero_historia_clinica INTEGER NOT NULL,
    nombre_apellidos VARCHAR(255) NOT NULL,
    carnet_identidad VARCHAR(20) UNIQUE,
    sexo CHAR(1),
    direccion INTEGER,
    id_area_geografica INTEGER REFERENCES AREAS_GEOGRAFICAS(id_area),
    id_nivel_escolar INTEGER REFERENCES NIVELES_ESCOLARES(id_nivel),
    id_ocupacion INTEGER REFERENCES OCUPACIONES(id_ocupacion),
    id_grupo_dispensarial INTEGER REFERENCES GRUPOS_DISPENSARIALES(id_grupo),
    id_color_piel INTEGER REFERENCES COLORES_PIEL(id_color),
    problemas_salud TEXT,
    observaciones TEXT,
    id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS(id_consultorio) ON DELETE CASCADE
);
```

3. Insertar datos iniciales

```sql
-- Insertar Provincia
INSERT INTO PROVINCIAS (nombre) VALUES ('Ciego de Avila');

-- Insertar Municipio
INSERT INTO MUNICIPIOS (nombre, id_provincia) VALUES ('Ciego de Avila', 1);

-- Insertar Policlinicos
INSERT INTO POLICLINICOS (nombre, id_municipio) VALUES
    ('Norte', 1),
    ('Sur', 1),
    ('Centro', 1),
    ('Belkis Sotomayor', 1),
    ('Ceballos', 1);

-- Insertar Consultorios (3 para cada policlinico)
INSERT INTO CONSULTORIOS (numero, id_policlinico) VALUES 
    ('1', 1), ('2', 1), ('3', 1),
    ('1', 2), ('2', 2), ('3', 2),
    ('1', 3), ('2', 3), ('3', 3),
    ('1', 4), ('2', 4), ('3', 4),
    ('1', 5), ('2', 5), ('3', 5);

-- Insertar Niveles Escolares
INSERT INTO NIVELES_ESCOLARES (descripcion) VALUES 
    ('Primario'), ('Secundario'), ('Universitario'), ('Postgrado');

-- Insertar Ocupaciones
INSERT INTO OCUPACIONES (descripcion) VALUES 
    ('Estudiante'), ('Maestro'), ('Ingeniero'), ('Médico'), ('Jubilado');

-- Insertar Grupos Dispensariales
INSERT INTO GRUPOS_DISPENSARIALES (descripcion) VALUES 
    ('I'), ('II'), ('III'), ('IV');

-- Insertar Sexos
INSERT INTO SEXOS (codigo, descripcion) VALUES
    ('M', 'Masculino'),
    ('F', 'Femenino'),
    ('N', 'No especificado');

-- Insertar Colores de Piel
INSERT INTO COLORES_PIEL (codigo, descripcion) VALUES
    ('B', 'Blanco'),
    ('M', 'Mestizo'),
    ('N', 'Negro');
```

---

## ⚙️ Variables de Entorno

### Backend (backend/.env)

Crea el archivo `.env` en la carpeta backend:

```env
# Servidor
PORT=5000

# Base de Datos PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=consultorios_familiares
DB_PASSWORD=tu_contraseña_de_postgres
DB_PORT=5432

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
```

### Frontend (frontend/.env) - Opcional

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Ejecución

1. Crear el Administrador

Antes de ejecutar la aplicación, crea el usuario administrador:

```bash
cd backend
node scripts/createAdmin.js
```

Salida esperada:

```bash
✅ Administrador creado exitosamente:
   Usuario: admin
   Contraseña: admin123
   Nombre: Administrador Principal

🔐 Accede en: http://localhost:5173/admin/login
```

2. Iniciar el Backend

```bash
cd backend
pnpm run dev
```

El servidor se iniciará en `http://localhost:5000`

3. Iniciar el Frontend

En otra terminal:

```bash
cd frontend
pnpm run dev
```

La aplicación se abrirá en `http://localhost:5173`

4. Acceder a la Aplicación

| Portal | URL | Descripción |
| :--- | :--- | :--- |
| 👨‍⚕️ **Médicos** | http://localhost:5173/login | Portal para médicos |
| 📝 **Registro** | http://localhost:5173/register | Registro de nuevos médicos |
| 🛡️ **Admin** | http://localhost:5173/admin/login | Panel de administración |

---

## 🔑 Credenciales por Defecto

### Administrador

| Campo | Valor |
| :--- | :--- |
| Usuario | `admin` |
| Contraseña | `admin123` |

### Médico (Crear uno nuevo)

- Accede a `http://localhost:5173/register`
- Completa el formulario con tus datos
- Selecciona tu consultorio asignado

---

## 🔌 API Endpoints

### Autenticación de Médicos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar médico |
| GET | `/api/auth/me` | Obtener usuario actual |

### Autenticación de Administradores
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/admin/login` | Iniciar sesión admin |
| GET | `/api/admin/me` | Obtener admin actual |
| GET | `/api/admin/estadisticas` | Estadísticas generales |

### Gestión de Pacientes (Requiere Auth)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/api/pacientes` | Listar pacientes |
| GET | `/api/pacientes/:id` | Obtener paciente |
| POST | `/api/pacientes` | Crear paciente |
| PUT | `/api/pacientes/:id` | Actualizar paciente |
| DELETE | `/api/pacientes/:id` | Eliminar paciente |
| GET | `/api/pacientes/search?q=` | Buscar pacientes |

### Catálogos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/api/catalogos/provincias` | Listar provincias |
| GET | `/api/catalogos/municipios/:id` | Municipios por provincia |
| GET | `/api/catalogos/policlinicos/:id` | Policlínicos por municipio |
| GET | `/api/catalogos/consultorios/:id` | Consultorios por policlínico |
| GET | `/api/catalogos/niveles-escolares` | Niveles escolares |
| GET | `/api/catalogos/ocupaciones` | Ocupaciones |
| GET | `/api/catalogos/grupos-dispensariales` | Grupos dispensariales |
| GET | `/api/catalogos/sexos` | Sexos |
| GET | `/api/catalogos/colores-piel` | Colores de piel |
| GET | `/api/catalogos/areas-geograficas` | Áreas geográficas |

### Administración de Ubicaciones (Requiere Admin Auth)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET/POST | `/api/admin/provincias` | Listar/Crear provincias |
| PUT/DELETE | `/api/admin/provincias/:id` | Actualizar/Eliminar provincia |
| GET/POST | `/api/admin/municipios` | Listar/Crear municipios |
| PUT/DELETE | `/api/admin/municipios/:id` | Actualizar/Eliminar municipio |
| GET/POST | `/api/admin/policlinicos` | Listar/Crear policlínicos |
| PUT/DELETE | `/api/admin/policlinicos/:id` | Actualizar/Eliminar policlínico |
| GET/POST | `/api/admin/consultorios` | Listar/Crear consultorios |
| PUT/DELETE | `/api/admin/consultorios/:id` | Actualizar/Eliminar consultorio |

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Crea una rama con tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit a la rama (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usa ESLint para el linting
- Sigue las convenciones de Conventional Commits
- Documenta las funciones nuevas
- Añade tests cuando sea posible

---

## 📝 Changelog

v1.0.0 (2024-01-XX)

- ✅ Versión inicial
- ✅ CRUD de pacientes
- ✅ Autenticación de médicos
- ✅ Panel de administración
- ✅ Gestión de ubicaciones

---

## 👨‍💻 Autor

José Antonio Cabrales Silvente

- [GitHub](https://github.com/josecabralesdev)