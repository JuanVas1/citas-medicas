const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { findConflicts } = require('../services/appointment.service');

const CHANGEABLE_STATUSES = ['pendiente', 'confirmada'];

const toDateTime = (date, time) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}:00`);
};

const canPatientModify = (appointment) => {
  const status = appointment.status?.toLowerCase();
  if (!CHANGEABLE_STATUSES.includes(status)) {
    return {
      allowed: false,
      reason: 'Solo puedes modificar o cancelar citas en estado Pendiente o Confirmada'
    };
  }

  const appointmentDate = toDateTime(appointment.date, appointment.startTime);
  if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
    return {
      allowed: false,
      reason: 'La cita tiene fecha u hora invalida'
    };
  }

  const hoursUntilAppointment = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilAppointment <= 24) {
    return {
      allowed: false,
      reason: 'Solo puedes modificar o cancelar con mas de 24 horas de anticipacion'
    };
  }

  return { allowed: true };
};

const createChangeNotifications = async ({ appointment, type, actionByUser }) => {
  const doctor = await Doctor.findById(appointment.doctorId).populate('userId', 'email name');
  const admins = await User.find({ role: 'administrador' }).select('email name');

  const recipients = [];
  if (doctor?.userId?.email) {
    recipients.push(doctor.userId.email);
  }

  admins.forEach((admin) => {
    if (admin.email) recipients.push(admin.email);
  });

  const uniqueRecipients = [...new Set(recipients)];
  if (uniqueRecipients.length === 0) return;

  await Promise.all(
    uniqueRecipients.map((email) =>
      Notification.create({
        appointmentId: appointment._id,
        recipientEmail: email,
        type,
        status: 'pendiente',
        payload: {
          appointmentId: appointment._id,
          status: appointment.status,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          changedBy: actionByUser?.email || actionByUser?._id?.toString() || 'sistema'
        }
      })
    )
  );
};

exports.getAll = async (req, res, next) => {
  try {
    const citas = await Appointment.find()
      .populate('patientId', 'name email')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .sort({ date: 1, startTime: 1 });
    return res.status(200).json(citas);
  } catch (error) {
    next(error);
  }
};
exports.getById = async (req, res, next) => {

  try {

    const cita = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!cita) {
      return res.status(404).json({
        error: 'Cita no encontrada'
      });
    }

    const isPacienteOwner =
      req.user.role === 'paciente' && cita.patientId?._id?.toString() === req.user._id.toString();
    const isDoctorOrAdmin = ['doctor', 'administrador'].includes(req.user.role);

    if (!isPacienteOwner && !isDoctorOrAdmin) {
      return res.status(403).json({ error: 'No autorizado para consultar esta cita' });
    }

    return res.status(200).json(cita);

  } catch (error) {
    next(error);
  }

};
exports.getMine = async (req, res, next) => {
  try {
    const citas = await Appointment.find({ patientId: req.user._id })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('history.changedBy', 'name email role')
      .sort({ date: 1, startTime: 1 });
    return res.status(200).json(citas);
  } catch (error) {
    next(error);
  }
};

exports.getMineHistory = async (req, res, next) => {
  try {
    const citas = await Appointment.find({ patientId: req.user._id })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('history.changedBy', 'name email role')
      .sort({ date: -1, startTime: -1 });

    return res.status(200).json(citas);
  } catch (error) {
    next(error);
  }
};

exports.getDoctorAgenda = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ error: 'No existe perfil de doctor para este usuario' });
    }

    const agenda = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email')
      .sort({ date: 1, startTime: 1 });

    return res.status(200).json(agenda);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { doctorId, date, startTime, endTime, reason } = req.body;

    if (!doctorId || !date || !startTime || !endTime || !reason) {
      return res.status(400).json({ error: 'doctorId, date, startTime, endTime y reason son obligatorios' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }

    const conflicts = await findConflicts({ doctorId, date, startTime, endTime });
    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'El bloque horario seleccionado ya esta ocupado' });
    }

    const cita = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      startTime,
      endTime,
      reason,
      status: 'pendiente',
      history: [
        {
          status: 'pendiente',
          changedBy: req.user._id,
          note: 'Cita creada'
        }
      ]
    });

    return res.status(201).json(cita);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const cita = await Appointment.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    if (!['pendiente', 'confirmada', 'completada', 'cancelada'].includes(status)) {
      return res.status(400).json({ error: 'Estado invalido' });
    }

    cita.status = status;
    if (note) cita.notes = note;
    cita.history.push({ status, changedBy: req.user._id, note: note || '' });
    await cita.save();

    return res.status(200).json(cita);
  } catch (error) {
    next(error);
  }
};

exports.rescheduleMine = async (req, res, next) => {
  try {
    const { date, startTime, endTime, reason } = req.body;
    const cita = await Appointment.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    if (cita.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No autorizado para modificar esta cita' });
    }

    const ruleCheck = canPatientModify(cita);
    if (!ruleCheck.allowed) {
      return res.status(400).json({ error: ruleCheck.reason });
    }

    if (!date || !startTime || !endTime || !reason) {
      return res.status(400).json({ error: 'date, startTime, endTime y reason son obligatorios' });
    }

    const nextDate = toDateTime(date, startTime);
    if (!nextDate || Number.isNaN(nextDate.getTime())) {
      return res.status(400).json({ error: 'Fecha u hora invalida' });
    }

    const hoursUntilAppointment = (nextDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilAppointment <= 24) {
      return res.status(400).json({ error: 'La nueva fecha debe ser con mas de 24 horas de anticipacion' });
    }

    const conflicts = await findConflicts({
      doctorId: cita.doctorId,
      date,
      startTime,
      endTime,
      excludeId: cita._id
    });

    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'El nuevo bloque horario seleccionado ya esta ocupado' });
    }

    const previousSnapshot = `${cita.date} ${cita.startTime}-${cita.endTime}`;

    cita.date = date;
    cita.startTime = startTime;
    cita.endTime = endTime;
    cita.reason = reason;
    cita.updatedAt = new Date();
    cita.history.push({
      status: cita.status,
      changedBy: req.user._id,
      note: `Reprogramada de ${previousSnapshot} a ${date} ${startTime}-${endTime}`
    });

    await cita.save();
    await createChangeNotifications({ appointment: cita, type: 'modificacion', actionByUser: req.user });

    return res.status(200).json(cita);
  } catch (error) {
    next(error);
  }
};

exports.cancelMine = async (req, res, next) => {
  try {
    const cita = await Appointment.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    if (cita.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No autorizado para cancelar esta cita' });
    }

    const ruleCheck = canPatientModify(cita);
    if (!ruleCheck.allowed) {
      return res.status(400).json({ error: ruleCheck.reason });
    }

    cita.status = 'cancelada';
    cita.updatedAt = new Date();
    cita.history.push({
      status: 'cancelada',
      changedBy: req.user._id,
      note: 'Cancelada por el paciente'
    });

    await cita.save();
    await createChangeNotifications({ appointment: cita, type: 'cancelacion', actionByUser: req.user });

    return res.status(200).json(cita);
  } catch (error) {
    next(error);
  }
};