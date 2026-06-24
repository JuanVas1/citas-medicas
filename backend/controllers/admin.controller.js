const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.dashboard = async (req, res, next) => {
  try {
    const [totalCitas, totalDoctores, totalPacientes] = await Promise.all([
      Appointment.countDocuments(),
      Doctor.countDocuments({ active: true }),
      User.countDocuments({ role: 'paciente' })
    ]);

    return res.status(200).json({ totalCitas, totalDoctores, totalPacientes });
  } catch (error) {
    next(error);
  }
};