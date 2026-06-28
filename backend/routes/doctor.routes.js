const express = require('express');
const { getDoctors, createDoctor, createFromUser, updateDoctorProfile } = require('../controllers/doctor.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', getDoctors);
router.post('/', authMiddleware, roleMiddleware('administrador'), createDoctor);
// Rutas especiales antes de /:id para evitar colisiones de Express
router.post('/from-user/:userId', authMiddleware, createFromUser);
router.put('/:id', authMiddleware, updateDoctorProfile);

module.exports = router;