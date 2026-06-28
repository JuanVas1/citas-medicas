/**
 * Script para limpiar el índice licenseNumber_1 que también puede causar
 * conflictos cuando múltiples doctores no tienen número de licencia.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/citas_medicas';

async function fixLicenseIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('doctors');

    const indexes = await collection.indexes();
    console.log('\n📋 Índices actuales:');
    indexes.forEach(idx => console.log(' -', JSON.stringify(idx)));

    const licenseIndex = indexes.find(idx => idx.name === 'licenseNumber_1');
    if (licenseIndex) {
      await collection.dropIndex('licenseNumber_1');
      console.log('\n🗑️  Índice "licenseNumber_1" eliminado (era único y bloqueaba doctores sin licencia).');
    } else {
      console.log('\nℹ️  El índice "licenseNumber_1" no existe.');
    }

    const finalIndexes = await collection.indexes();
    console.log('\n📋 Índices finales:');
    finalIndexes.forEach(idx => console.log(' -', JSON.stringify(idx)));

    console.log('\n✅ Listo.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixLicenseIndex();
