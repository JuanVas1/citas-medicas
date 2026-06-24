const Appointment = require('../models/Appointment');

const findConflicts = async ({ doctorId, date, startTime, endTime, excludeId = null }) => {
  const query = {
    doctorId,
    date,
    status: { $in: ['pendiente', 'confirmada'] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  };

  if (excludeId) query._id = { $ne: excludeId };

  return Appointment.find(query);
};

module.exports = {
  findConflicts
};