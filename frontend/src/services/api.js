import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const isAdmin = localStorage.getItem('adminToken');
      if (isAdmin) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  register: (userData) => api.post('/admin/register', userData),
  getMe: () => api.get('/admin/me')
};

// Admin API (CRUD de ubicaciones)
export const adminAPI = {
  // Estadísticas
  getEstadisticas: () => api.get('/admin/estadisticas'),

  // Provincias
  getProvincias: () => api.get('/admin/provincias'),
  createProvincia: (data) => api.post('/admin/provincias', data),
  updateProvincia: (id, data) => api.put(`/admin/provincias/${id}`, data),
  deleteProvincia: (id) => api.delete(`/admin/provincias/${id}`),

  // Municipios
  getMunicipios: () => api.get('/admin/municipios'),
  getMunicipiosByProvincia: (provinciaId) => api.get(`/admin/municipios/provincia/${provinciaId}`),
  createMunicipio: (data) => api.post('/admin/municipios', data),
  updateMunicipio: (id, data) => api.put(`/admin/municipios/${id}`, data),
  deleteMunicipio: (id) => api.delete(`/admin/municipios/${id}`),

  // Policlínicos
  getPoliclinicos: () => api.get('/admin/policlinicos'),
  getPoliclinicosByMunicipio: (municipioId) => api.get(`/admin/policlinicos/municipio/${municipioId}`),
  createPoliclinico: (data) => api.post('/admin/policlinicos', data),
  updatePoliclinico: (id, data) => api.put(`/admin/policlinicos/${id}`, data),
  deletePoliclinico: (id) => api.delete(`/admin/policlinicos/${id}`),

  // Consultorios
  getConsultorios: () => api.get('/admin/consultorios'),
  getConsultoriosByPoliclinico: (policlinicoId) => api.get(`/admin/consultorios/policlinico/${policlinicoId}`),
  createConsultorio: (data) => api.post('/admin/consultorios', data),
  updateConsultorio: (id, data) => api.put(`/admin/consultorios/${id}`, data),
  deleteConsultorio: (id) => api.delete(`/admin/consultorios/${id}`)
};

// Pacientes API
export const pacientesAPI = {
  getAll: () => api.get('/pacientes'),
  getOne: (id) => api.get(`/pacientes/${id}`),
  create: (data) => api.post('/pacientes', data),
  update: (id, data) => api.put(`/pacientes/${id}`, data),
  delete: (id) => api.delete(`/pacientes/${id}`),
  search: (query) => api.get(`/pacientes/search?q=${query}`)
};

// Catálogos API
export const catalogosAPI = {
  getProvincias: () => api.get('/catalogos/provincias'),
  getMunicipios: (provinciaId) => api.get(`/catalogos/municipios/${provinciaId}`),
  getPoliclinicos: (municipioId) => api.get(`/catalogos/policlinicos/${municipioId}`),
  getConsultorios: (policlinicoId) => api.get(`/catalogos/consultorios/${policlinicoId}`),
  getAllConsultorios: () => api.get('/catalogos/consultorios'),
  getNivelesEscolares: () => api.get('/catalogos/niveles-escolares'),
  getGruposDispensariales: () => api.get('/catalogos/grupos-dispensariales'),
  getSexos: () => api.get('/catalogos/sexos'),
  getColoresPiel: () => api.get('/catalogos/colores-piel'),
  getOcupaciones: () => api.get('/catalogos/ocupaciones'),
  createOcupacion: (data) => api.post('/catalogos/ocupaciones', data),
  updateOcupacion: (id, data) => api.put(`/catalogos/ocupaciones/${id}`, data),
  deleteOcupacion: (id) => api.delete(`/catalogos/ocupaciones/${id}`),
  getAreasGeograficas: () => api.get('/catalogos/areas-geograficas'),
  createAreaGeografica: (data) => api.post('/catalogos/areas-geograficas', data),
  updateAreaGeografica: (id, data) => api.put(`/catalogos/areas-geograficas/${id}`, data),
  deleteAreaGeografica: (id) => api.delete(`/catalogos/areas-geograficas/${id}`)
};

export default api;