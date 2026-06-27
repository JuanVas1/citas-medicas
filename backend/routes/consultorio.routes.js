const express = require('express');
const {
  getConsultorios,
  createConsultorio,
  updateConsultorio,
  deleteConsultorio,
  toggleConsultorio
} = require('../controllers/consultorio.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('administrador'), getConsultorios);
router.post('/', authMiddleware, roleMiddleware('administrador'), createConsultorio);
router.put('/:id', authMiddleware, roleMiddleware('administrador'), updateConsultorio);
router.patch('/:id/toggle', authMiddleware, roleMiddleware('administrador'), toggleConsultorio);
router.delete('/:id', authMiddleware, roleMiddleware('administrador'), deleteConsultorio);

module.exports = router;
