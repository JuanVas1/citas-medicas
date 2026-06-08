const express = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/', protect, getAppointments);
router.put('/:id', protect, updateAppointment);
router.patch('/:id/cancel', protect, cancelAppointment);

module.exports = router;
