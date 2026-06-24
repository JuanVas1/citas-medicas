

const express = require('express');
const {
  getAll,
  getById,
  getMine,
  getMineHistory,
  getDoctorAgenda,
  create,
  updateStatus,
  rescheduleMine,
  cancelMine
} = require('../controllers/cita.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('administrador'), getAll);
router.get('/mias', authMiddleware, roleMiddleware('paciente'), getMine);
router.get('/mias/historial', authMiddleware, roleMiddleware('paciente'), getMineHistory);
router.get('/agenda-doctor', authMiddleware, roleMiddleware('doctor'), getDoctorAgenda);
router.post('/', authMiddleware, roleMiddleware('paciente'), create);
router.patch('/:id/estado', authMiddleware, roleMiddleware('administrador', 'doctor'), updateStatus);
router.put('/:id/reprogramar', authMiddleware, roleMiddleware('paciente'), rescheduleMine);
router.patch('/:id/cancelar', authMiddleware, roleMiddleware('paciente'), cancelMine);
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('doctor', 'administrador', 'paciente'),
  getById
);

module.exports = router;