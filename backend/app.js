require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const horarioRoutes = require('./routes/horario.routes');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/doctors', require('./routes/doctor.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/horarios', horarioRoutes);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/citas_medicas';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar MongoDB:', error.message);
    process.exit(1);
  });