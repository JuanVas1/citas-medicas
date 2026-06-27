const mongoose = require('mongoose');

const consultorioSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: [true, 'El número del consultorio es requerido'],
    unique: true,
    trim: true
  },
  piso: {
    type: String,
    required: [true, 'El piso del consultorio es requerido'],
    trim: true
  },
  especialidad: {
    type: String,
    required: [true, 'La especialidad del consultorio es requerida'],
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultorio', consultorioSchema);
