const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: String,
    required: [true, 'La fecha es requerida']
  },
  startTime: {
    type: String,
    required: [true, 'La hora es requerida']
  },
  endTime: {
    type: String,
    required: [true, 'La hora fin es requerida']
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  history: [
    {
      status: String,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      note: String,
      changedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

appointmentSchema.index({ doctorId: 1, date: 1, startTime: 1, endTime: 1 });
// Índice compuesto para RN-04: búsqueda rápida de duplicados paciente-doctor-fecha
appointmentSchema.index({ patientId: 1, doctorId: 1, date: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
