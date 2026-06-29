require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const horarioRoutes = require('./routes/horario.routes');
const { startReminderJob } = require('./services/reminder.service');
const app = express();

// Logging HTTP
app.use(morgan('dev'));

// Seguridad: headers HTTP
app.use(helmet());

// CORS: restringir orígenes permitidos
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));

// Rate-limit para endpoints de autenticación (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 intentos por IP
  message: { error: 'Demasiados intentos. Intente de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/doctors', require('./routes/doctor.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/horarios', horarioRoutes);
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/consultorios', require('./routes/consultorio.routes'));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/citas_medicas';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado correctamente');
    startReminderJob();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar MongoDB:', error.message);
    process.exit(1);
  });