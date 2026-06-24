const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    recipientEmail: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['confirmacion', 'recordatorio', 'cancelacion', 'modificacion'],
      required: true
    },
    status: {
      type: String,
      enum: ['pendiente', 'enviada', 'fallida'],
      default: 'pendiente'
    },
    payload: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);