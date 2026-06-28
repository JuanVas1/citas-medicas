/**
 * Script para limpiar índices obsoletos de la colección 'doctors'.
 * El índice 'email_1' quedó de una versión antigua del schema y causa
 * conflictos al crear nuevos perfiles médicos.
 *
 * Uso: node scripts/fix-doctor-indexes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/citas_medicas';

async function fixIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('doctors');

    // Listar índices actuales
    const indexes = await collection.indexes();
    console.log('\n📋 Índices actuales en la colección doctors:');
    indexes.forEach(idx => console.log(' -', JSON.stringify(idx)));

    // Eliminar el índice email_1 si existe
    const emailIndex = indexes.find(idx => idx.name === 'email_1');
    if (emailIndex) {
      await collection.dropIndex('email_1');
      console.log('\n🗑️  Índice "email_1" eliminado correctamente.');
    } else {
      console.log('\nℹ️  El índice "email_1" no existe. No se requiere acción.');
    }

    // Mostrar índices finales
    const finalIndexes = await collection.indexes();
    console.log('\n📋 Índices finales:');
    finalIndexes.forEach(idx => console.log(' -', JSON.stringify(idx)));

    console.log('\n✅ Listo. Puedes reiniciar el servidor backend.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixIndexes();
