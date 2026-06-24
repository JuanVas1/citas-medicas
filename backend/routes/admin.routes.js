const express = require('express');
const { dashboard } = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, roleMiddleware('administrador'), dashboard);

module.exports = router;