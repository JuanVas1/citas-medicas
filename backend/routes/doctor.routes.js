const express = require('express');
const { getDoctors, createDoctor } = require('../controllers/doctor.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', getDoctors);
router.post('/', authMiddleware, roleMiddleware('administrador'), createDoctor);

module.exports = router;