const express = require('express');

const {
  getAll,
  create,
  deleteHorario
} = require('../controllers/horario.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
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

module.exports = router;