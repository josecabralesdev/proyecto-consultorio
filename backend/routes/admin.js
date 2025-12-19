const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, getMe } = require('../controllers/adminAuthController');
const {
  getProvincias, createProvincia, updateProvincia, deleteProvincia,
  getMunicipios, getMunicipiosByProvincia, createMunicipio, updateMunicipio, deleteMunicipio,
  getPoliclinicos, getPoliclinicosByMunicipio, createPoliclinico, updatePoliclinico, deletePoliclinico,
  getConsultorios, getConsultoriosByPoliclinico, createConsultorio, updateConsultorio, deleteConsultorio,
  getEstadisticas
} = require('../controllers/ubicacionesController');
const authenticateAdmin = require('../middleware/adminAuth');

// Auth routes
router.post('/login', loginAdmin);
router.post('/register', authenticateAdmin, registerAdmin);
router.get('/me', authenticateAdmin, getMe);

// Estadísticas
router.get('/estadisticas', authenticateAdmin, getEstadisticas);

// Provincias
router.get('/provincias', authenticateAdmin, getProvincias);
router.post('/provincias', authenticateAdmin, createProvincia);
router.put('/provincias/:id', authenticateAdmin, updateProvincia);
router.delete('/provincias/:id', authenticateAdmin, deleteProvincia);

// Municipios
router.get('/municipios', authenticateAdmin, getMunicipios);
router.get('/municipios/provincia/:provinciaId', authenticateAdmin, getMunicipiosByProvincia);
router.post('/municipios', authenticateAdmin, createMunicipio);
router.put('/municipios/:id', authenticateAdmin, updateMunicipio);
router.delete('/municipios/:id', authenticateAdmin, deleteMunicipio);

// Policlínicos
router.get('/policlinicos', authenticateAdmin, getPoliclinicos);
router.get('/policlinicos/municipio/:municipioId', authenticateAdmin, getPoliclinicosByMunicipio);
router.post('/policlinicos', authenticateAdmin, createPoliclinico);
router.put('/policlinicos/:id', authenticateAdmin, updatePoliclinico);
router.delete('/policlinicos/:id', authenticateAdmin, deletePoliclinico);

// Consultorios
router.get('/consultorios', authenticateAdmin, getConsultorios);
router.get('/consultorios/policlinico/:policlinicoId', authenticateAdmin, getConsultoriosByPoliclinico);
router.post('/consultorios', authenticateAdmin, createConsultorio);
router.put('/consultorios/:id', authenticateAdmin, updateConsultorio);
router.delete('/consultorios/:id', authenticateAdmin, deleteConsultorio);

module.exports = router;