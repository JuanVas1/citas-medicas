const express = require('express');
const { getUsers, updateProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// GET /api/users - list users (admin only)
router.get('/', authMiddleware, roleMiddleware('administrador'), getUsers);

// PUT /api/users/profile - update authenticated user profile
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
