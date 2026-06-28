/**
 * Script temporal para revisar la relación entre doctores y horarios en MongoDB.
 * Ejecutar con: node scripts/check-data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/citas_medicas';

// Registrar Schemas mínimos
const Doctor = mongoose.model('Doctor', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
}), 'doctors');

const Horario = mongoose.model('Horario', new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  day: String,
  startTime: String,
  endTime: String
}), 'horarios');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  role: String
}), 'users');

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const doctors = await Doctor.find().populate('userId');
    const horarios = await Horario.find().populate({
      path: 'doctorId',
      populate: { path: 'userId' }
    });

    console.log('\n👨‍⚕️ DOCTORES REGISTRADOS EN LA COLECCIÓN "doctors":');
    doctors.forEach(d => {
      console.log(`- Doctor _id (Doctor): ${d._id}`);
      console.log(`  Nombre: ${d.userId?.name || 'Sin nombre'}`);
      console.log(`  User ID: ${d.userId?._id || 'Sin usuario'}`);
      console.log(`  Activo: ${d.active}`);
    });

    console.log('\n📅 HORARIOS REGISTRADOS EN LA COLECCIÓN "horarios":');
    horarios.forEach(h => {
      console.log(`- Horario _id: ${h._id}`);
      console.log(`  Asociado a Doctor ID: ${h.doctorId?._id || h.doctorId}`);
      console.log(`  Nombre Doctor: ${h.doctorId?.userId?.name || 'Desconocido'}`);
      console.log(`  Día: ${h.day} (${h.startTime} - ${h.endTime})`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkData();
