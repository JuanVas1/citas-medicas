/**
 * reminder.service.js
 * RN-07: Recordatorio automático 24 horas antes, solo para citas en estado 'confirmada'.
 * Se ejecuta cada hora buscando citas del día siguiente que estén confirmadas
 * y que aún no tengan una notificación de recordatorio creada.
 */

const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// SOLAMENTE AGREGAMOS ESTO PARA LOS CORREOS:
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const INTERVAL_MS = 60 * 60 * 1000; // cada 1 hora

const runReminderJob = async () => {
  try {
    // Calcular la fecha de mañana en formato 'YYYY-MM-DD'
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Buscar citas confirmadas del día siguiente
    const citasConfirmadas = await Appointment.find({
      status: 'confirmada',
      date: tomorrowStr
    }).populate('patientId', 'email name');

    if (citasConfirmadas.length === 0) return;

    for (const cita of citasConfirmadas) {
      // Verificar que no exista ya un recordatorio para esta cita
      const yaExiste = await Notification.findOne({
        appointmentId: cita._id,
        type: 'recordatorio'
      });

      if (yaExiste) continue;

      // Crear notificación de recordatorio para el paciente
      const recipientEmail = cita.patientId?.email;
      if (!recipientEmail) continue;

      // TU CÓDIGO ORIGINAL INTACTO:
      await Notification.create({
        appointmentId: cita._id,
        recipientEmail,
        type: 'recordatorio',
        status: 'pendiente',
        payload: {
          appointmentId: cita._id,
          date: cita.date,
          startTime: cita.startTime,
          endTime: cita.endTime,
          patientName: cita.patientId?.name || ''
        }
      });

      console.log(`[RN-07] Recordatorio creado para cita ${cita._id} (${recipientEmail}) - ${cita.date} ${cita.startTime}`);

      // SOLAMENTE AGREGAMOS ESTO PARA ENVIAR EL CORREO FÍSICO:
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipientEmail,
          subject: 'Recordatorio de Cita Médica',
          text: `Hola ${cita.patientId?.name || ''}, te recordamos tu cita médica programada para el día ${cita.date} a las ${cita.startTime}.`
        });
        console.log(`[CUS-14] Correo enviado exitosamente a ${recipientEmail}`);
      } catch (mailError) {
        console.error(`[CUS-14] Error al enviar el correo a ${recipientEmail}:`, mailError.message);
      }
      // FIN DEL AGREGADO

    }
  } catch (error) {
    console.error('[RN-07] Error en job de recordatorios:', error.message);
  }
};

const startReminderJob = () => {
  console.log('[RN-07] Servicio de recordatorios iniciado (intervalo: 1 hora)');
  // Ejecutar inmediatamente al iniciar para no esperar la primera hora
  runReminderJob();
  setInterval(runReminderJob, INTERVAL_MS);
};

module.exports = { startReminderJob };