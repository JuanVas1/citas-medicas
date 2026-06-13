export const SPECIALITIES = [
  'Cardiologia',
  'Dermatologia',
  'Pediatria',
  'Oftalmologia',
  'Neurologia',
  'Psicologia',
  'Medicina general'
];

export const STATUS_LABELS = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada'
};

export const emptyDoctorForm = {
  name: '',
  speciality: SPECIALITIES[0],
  phone: '',
  email: '',
  licenseNumber: ''
};

export function formatDate(value) {
  if (!value) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || 'Sin estado';
}
