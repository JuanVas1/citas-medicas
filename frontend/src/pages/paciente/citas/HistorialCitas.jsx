import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { citaService } from '../../../services/citaService';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatSimpleDate = (value) => {
  if (!value || typeof value !== 'string') return '-';
  const [y, m, d] = value.split('-');
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
};

const normalize = (raw) => ({
  id: raw._id || raw.id,
  doctor: raw.doctorId?.userId?.name || raw.doctorId?.name || 'Doctor',
  especialidad: raw.doctorId?.specialty || '-',
  date: raw.date || raw.fecha,
  startTime: raw.startTime || raw.hora,
  status: raw.status || raw.estado,
  reason: raw.reason || raw.motivo || '-',
  history: Array.isArray(raw.history) ? raw.history : []
});

const HistorialCitas = ({ isWidget } = {}) => {
	const [citas, setCitas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const cargarHistorial = async () => {
			setLoading(true);
			setError('');

			try {
				const res = await citaService.getMineHistory();
				const data = Array.isArray(res.data) ? res.data : [];
				setCitas(data.map(normalize));
			} catch (err) {
				setError(err.response?.data?.error || 'No se pudo cargar el historial de citas');
			} finally {
				setLoading(false);
			}
		};

		cargarHistorial();
	}, []);

	const mainContent = (
		<div className="mx-auto max-w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
			{!isWidget && (
				<Link
					to="/paciente"
					className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#1565D8] transition"
				>
					<ArrowLeft size={16} />
					Volver
				</Link>
			)}

			<h1 className="text-2xl font-bold text-gray-900">Historial de Citas</h1>
			<p className="mt-2 text-sm text-gray-500">
				Consulta el ciclo de vida completo de cada cita, con estados, fecha de cambio y actor responsable.
			</p>

			{error && (
				<p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
			)}

			{loading && <p className="mt-5 text-sm text-gray-500">Cargando historial...</p>}

			{!loading && citas.length === 0 && (
				<p className="mt-5 text-sm text-gray-500">Aun no tienes citas para mostrar en el historial.</p>
			)}

			{!loading && citas.length > 0 && (
				<div className="mt-6 space-y-5">
					{citas.map((cita) => (
						<article key={cita.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
							<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-sm font-semibold text-gray-800">
									{cita.doctor} · {cita.especialidad}
								</p>
								<p className="text-xs text-gray-500">
									{formatSimpleDate(cita.date)} {cita.startTime || '-'}
								</p>
							</div>

							<p className="mt-2 text-sm text-gray-600">
								Motivo: {cita.reason}
							</p>

							<div className="mt-3">
								<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
									Trazabilidad de estados
								</p>

								{cita.history.length === 0 && (
									<p className="mt-1 text-sm text-gray-500">Sin cambios de estado registrados.</p>
								)}

								{cita.history.length > 0 && (
									<ul className="mt-2 space-y-2">
										{cita.history.map((h, idx) => (
											<li key={`${cita.id}-${idx}`} className="rounded-md border border-gray-200 bg-white p-3">
												<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
													<span className="text-sm font-semibold capitalize text-gray-800">
														Estado: {h.status || '-'}
													</span>
													<span className="text-xs text-gray-500">
														{formatDate(h.changedAt)}
													</span>
												</div>
												<p className="mt-1 text-xs text-gray-600">
													Actor: {h.changedBy?.name || h.changedBy?.email || 'Sistema'}
												</p>
												{h.note && <p className="mt-1 text-xs text-gray-500">Detalle: {h.note}</p>}
											</li>
										))}
									</ul>
								)}
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	);

	if (isWidget) {
		return mainContent;
	}

	return (
		<main className="min-h-screen bg-[#faf9f5] px-4 py-10">
			{mainContent}
		</main>
	);
};

export default HistorialCitas;
