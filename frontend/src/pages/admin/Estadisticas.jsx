import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarClock, Stethoscope, Clock3, CheckCircle2, XCircle } from 'lucide-react';
import { citaService } from '../../services/citaService';
import { doctorService } from '../../services/doctorService';
import { horarioService } from '../../services/horarioService';

const toArray = (payload) => {
	if (Array.isArray(payload)) return payload;
	if (Array.isArray(payload?.data)) return payload.data;
	return [];
};

const calcularPorcentaje = (parcial, total) => {
	if (!total) return '0%';
	return `${Math.round((parcial / total) * 100)}%`;
};

const Estadisticas = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [citas, setCitas] = useState([]);
	const [doctores, setDoctores] = useState([]);
	const [horarios, setHorarios] = useState([]);

	useEffect(() => {
		const cargarDatos = async () => {
			setLoading(true);
			setError('');

			try {
				const [citasRes, doctoresRes, horariosRes] = await Promise.all([
					citaService.getAll(),
					doctorService.getAll(),
					horarioService.getAll(),
				]);

				setCitas(toArray(citasRes?.data));
				setDoctores(toArray(doctoresRes?.data));
				setHorarios(toArray(horariosRes?.data));
			} catch (err) {
				setError(err.response?.data?.error || 'No se pudieron cargar las estadisticas');
			} finally {
				setLoading(false);
			}
		};

		cargarDatos();
	}, []);

	const resumen = useMemo(() => {
		const total = citas.length;
		const pendientes = citas.filter((c) => c.status === 'pendiente').length;
		const confirmadas = citas.filter((c) => c.status === 'confirmada').length;
		const completadas = citas.filter((c) => c.status === 'completada').length;
		const canceladas = citas.filter((c) => c.status === 'cancelada').length;

		return {
			total,
			pendientes,
			confirmadas,
			completadas,
			canceladas,
		};
	}, [citas]);

	return (
		<main className="min-h-screen bg-slate-100 p-8">
			<div className="mx-auto max-w-7xl">
				<Link
					to="/admin"
				className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium"
				style={{ color: '#2563EB' }}
			>
				<ArrowLeft size={16} />
					Volver al panel admin
				</Link>

				<h1 className="text-3xl font-bold" style={{ color: '#2563EB' }}>Estadisticas del Sistema</h1>
				<p className="mt-1 text-sm text-gray-600">Resumen general de citas, doctores y horarios.</p>

				{error && (
					<p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
				)}

				<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					<article className="rounded-xl bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between text-gray-500">
							<span className="text-sm">Total citas</span>
							<CalendarClock size={17} />
						</div>
						<p className="mt-3 text-3xl font-bold text-gray-900">{resumen.total}</p>
					</article>

					<article className="rounded-xl bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between text-gray-500">
							<span className="text-sm">Pendientes</span>
							<Clock3 size={17} />
						</div>
						<p className="mt-3 text-3xl font-bold text-amber-600">{resumen.pendientes}</p>
						<p className="mt-1 text-xs text-gray-500">{calcularPorcentaje(resumen.pendientes, resumen.total)}</p>
					</article>

					<article className="rounded-xl bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between text-gray-500">
							<span className="text-sm">Confirmadas</span>
							<CheckCircle2 size={17} />
						</div>
						<p className="mt-3 text-3xl font-bold" style={{ color: '#2563EB' }}>{resumen.confirmadas}</p>
						<p className="mt-1 text-xs text-gray-500">{calcularPorcentaje(resumen.confirmadas, resumen.total)}</p>
					</article>

					<article className="rounded-xl bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between text-gray-500">
							<span className="text-sm">Completadas</span>
							<CheckCircle2 size={17} />
						</div>
						<p className="mt-3 text-3xl font-bold text-green-600">{resumen.completadas}</p>
						<p className="mt-1 text-xs text-gray-500">{calcularPorcentaje(resumen.completadas, resumen.total)}</p>
					</article>

					<article className="rounded-xl bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between text-gray-500">
							<span className="text-sm">Canceladas</span>
							<XCircle size={17} />
						</div>
						<p className="mt-3 text-3xl font-bold text-red-600">{resumen.canceladas}</p>
						<p className="mt-1 text-xs text-gray-500">{calcularPorcentaje(resumen.canceladas, resumen.total)}</p>
					</article>
				</div>

				<div className="mt-6 grid gap-4 md:grid-cols-2">
					<article className="rounded-xl bg-white p-5 shadow-sm">
						<p className="text-sm text-gray-500">Doctores activos</p>
						<p className="mt-2 flex items-center gap-2 text-3xl font-bold text-gray-900">
							<Stethoscope size={22} style={{ color: '#2563EB' }} />
							{doctores.length}
						</p>
					</article>

					<article className="rounded-xl bg-white p-5 shadow-sm">
						<p className="text-sm text-gray-500">Horarios registrados</p>
						<p className="mt-2 flex items-center gap-2 text-3xl font-bold text-gray-900">
							<Clock3 size={22} style={{ color: '#2563EB' }} />
							{horarios.length}
						</p>
					</article>
				</div>

				<section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
					<h2 className="text-lg font-semibold" style={{ color: '#2563EB' }}>Ultimas citas</h2>

					{loading && <p className="mt-3 text-sm text-gray-500">Cargando datos...</p>}

					{!loading && citas.length === 0 && (
						<p className="mt-3 text-sm text-gray-500">No hay citas registradas.</p>
					)}

					{!loading && citas.length > 0 && (
						<div className="mt-4 overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="border-b bg-gray-50">
										<th className="p-3 text-left">Paciente</th>
										<th className="p-3 text-left">Doctor</th>
										<th className="p-3 text-left">Fecha</th>
										<th className="p-3 text-left">Hora</th>
										<th className="p-3 text-left">Estado</th>
									</tr>
								</thead>
								<tbody>
									{citas.slice(0, 10).map((cita) => (
										<tr key={cita._id} className="border-b last:border-0">
											<td className="p-3">{cita.patientId?.name || 'Paciente'}</td>
											<td className="p-3">{cita.doctorId?.userId?.name || cita.doctorId?.name || 'Doctor'}</td>
											<td className="p-3">{cita.date || '-'}</td>
											<td className="p-3">{cita.startTime || '-'}</td>
											<td className="p-3 capitalize">{cita.status || '-'}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</section>
			</div>
		</main>
	);
};

export default Estadisticas;
