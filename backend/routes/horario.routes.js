const express = require('express');

const {
  getAll,
  create,
  deleteHorario,
  getByDoctor
} = require('../controllers/horario.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  roleMiddleware('administrador'),
  getAll
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('administrador'),
  create
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador'),
  deleteHorario
);

// Ruta pública: ver horarios de un doctor específico (pacientes, sin auth)
router.get(
  '/doctor/:doctorId',
  getByDoctor
);

module.exports = router;