const express = require('express');
const router = express.Router();
const {
  getProvincias,
  getMunicipios,
  getPoliclinicos,
  getConsultorios,
  getAllConsultorios,
  getNivelesEscolares,
  getOcupaciones,
  createOcupacion,
  updateOcupacion,
  deleteOcupacion,
  getGruposDispensariales,
  getSexos,
  getColoresPiel,
  getAreasGeograficas,
  createAreaGeografica,
  updateAreaGeografica,
  deleteAreaGeografica
} = require('../controllers/catalogosController');
const authenticateToken = require('../middleware/auth');

// Rutas públicas (para registro)
router.get('/provincias', getProvincias);
router.get('/municipios/:provinciaId', getMunicipios);
router.get('/policlinicos/:municipioId', getPoliclinicos);
router.get('/consultorios/:policlinicoId', getConsultorios);
router.get('/consultorios', getAllConsultorios);

// Rutas protegidas - Catálogos de solo lectura
router.get('/niveles-escolares', authenticateToken, getNivelesEscolares);
router.get('/grupos-dispensariales', authenticateToken, getGruposDispensariales);
router.get('/sexos', authenticateToken, getSexos);
router.get('/colores-piel', authenticateToken, getColoresPiel);

// Rutas protegidas - Ocupaciones (CRUD)
router.get('/ocupaciones', authenticateToken, getOcupaciones);
router.post('/ocupaciones', authenticateToken, createOcupacion);
router.put('/ocupaciones/:id', authenticateToken, updateOcupacion);
router.delete('/ocupaciones/:id', authenticateToken, deleteOcupacion);

// Rutas protegidas - Áreas Geográficas (CRUD)
router.get('/areas-geograficas', authenticateToken, getAreasGeograficas);
router.post('/areas-geograficas', authenticateToken, createAreaGeografica);
router.put('/areas-geograficas/:id', authenticateToken, updateAreaGeografica);
router.delete('/areas-geograficas/:id', authenticateToken, deleteAreaGeografica);

module.exports = router;