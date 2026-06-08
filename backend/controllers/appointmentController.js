const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ error: 'Por favor completa todos los campos requeridos' });
    }

    const appointment = new Appointment({
      clientId: req.user._id,
      doctorId,
      date,
      time,
      reason
    });

    await appointment.save();
    await appointment.populate('doctorId', 'name speciality');

    res.status(201).json({
      success: true,
      appointment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    
    // Si el usuario es cliente, solo ver sus citas
    if (req.user.role === 'cliente') {
      query.clientId = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('clientId', 'name email phone')
      .populate('doctorId', 'name speciality')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    // Solo admin puede actualizar estado y notas
    if (req.user.role === 'admin') {
      if (status) appointment.status = status;
      if (notes) appointment.notes = notes;
    }

    appointment.updatedAt = new Date();
    await appointment.save();

    res.json({
      success: true,
      appointment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    appointment.status = 'cancelada';
    await appointment.save();

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
