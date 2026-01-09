const express = require('express');
const router = express.Router();
const {
  getPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
  searchPacientes,
  calculateAgeFromCI
} = require('../controllers/pacientesController');
const authenticateToken = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', getPacientes);
router.get('/search', searchPacientes);
router.post('/calculate-age', calculateAgeFromCI);
router.get('/:id', getPaciente);
router.post('/', createPaciente);
router.put('/:id', updatePaciente);
router.delete('/:id', deletePaciente);

module.exports = router;