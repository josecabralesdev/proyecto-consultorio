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
  getGruposDispensariales,
  getSexos,
  getAreasGeograficas,
  createAreaGeografica
} = require('../controllers/catalogosController');
const authenticateToken = require('../middleware/auth');

// Rutas públicas (para registro)
router.get('/provincias', getProvincias);
router.get('/municipios/:provinciaId', getMunicipios);
router.get('/policlinicos/:municipioId', getPoliclinicos);
router.get('/consultorios/:policlinicoId', getConsultorios);
router.get('/consultorios', getAllConsultorios);

// Rutas protegidas
router.get('/niveles-escolares', authenticateToken, getNivelesEscolares);
router.get('/ocupaciones', authenticateToken, getOcupaciones);
router.get('/grupos-dispensariales', authenticateToken, getGruposDispensariales);
router.get('/sexos', authenticateToken, getSexos);
router.get('/areas-geograficas', authenticateToken, getAreasGeograficas);
router.post('/areas-geograficas', authenticateToken, createAreaGeografica);

module.exports = router;