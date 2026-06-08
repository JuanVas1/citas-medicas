const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del doctor es requerido']
  },
  speciality: {
    type: String,
    required: [true, 'La especialidad es requerida'],
    enum: ['Cardiología', 'Dermatología', 'Pediatría', 'Oftalmología', 'Neurología', 'Psicología', 'Generales']
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
