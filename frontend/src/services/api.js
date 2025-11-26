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
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
  getOcupaciones: () => api.get('/catalogos/ocupaciones'),
  getGruposDispensariales: () => api.get('/catalogos/grupos-dispensariales'),
  getSexos: () => api.get('/catalogos/sexos'),
  getAreasGeograficas: () => api.get('/catalogos/areas-geograficas'),
  createAreaGeografica: (data) => api.post('/catalogos/areas-geograficas', data)
};

export default api;