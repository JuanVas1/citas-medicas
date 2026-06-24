import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AgendarCita = () => {
	const [doctors, setDoctors] = useState([]);
	const [loading, setLoading] = useState(true);

	const [formData, setFormData] = useState({
		doctorId: '',
		date: '',
		startTime: '',
		endTime: '',
		reason: '',
	});

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/doctors');
				const data = await response.json();

				console.log('Doctores:', data);

				setDoctors(data);
			} catch (error) {
				console.error('Error al cargar doctores:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchDoctors();
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const token = localStorage.getItem('token');

			const response = await fetch(
				'http://localhost:5000/api/citas',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Error al crear cita');
			}

			alert('Cita agendada correctamente');

			setFormData({
				doctorId: '',
				date: '',
				startTime: '',
				endTime: '',
				reason: '',
			});

			console.log(data);
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	};

	return (
		<main className="min-h-screen bg-[#f5f8fd] px-4 py-10">
			<div className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
				<Link
					to="/paciente"
					className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1565D8]"
				>
					<ArrowLeft size={15} />
					Volver al dashboard
				</Link>

				<h1 className="text-2xl font-bold text-gray-900">
					Agendar Cita Médica
				</h1>

				<p className="mt-2 text-sm text-gray-500">
					Seleccione un doctor y complete los datos de la cita.
				</p>

				<form
					onSubmit={handleSubmit}
					className="mt-8 space-y-5"
				>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Doctor
						</label>

						<select
							name="doctorId"
							value={formData.doctorId}
							onChange={handleChange}
							required
							className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#1565D8] focus:outline-none"
						>
							<option value="">
								{loading
									? 'Cargando doctores...'
									: 'Seleccione un doctor'}
							</option>

							{doctors.map((doctor) => (
	<option
		key={doctor._id}
		value={doctor._id}
	>
		{doctor.userId?.name || doctor.name} - {doctor.specialty || doctor.speciality}
	</option>
))}
						</select>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Fecha
						</label>

						<input
							type="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							required
							className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#1565D8] focus:outline-none"
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-2 block text-sm font-medium text-gray-700">
								Hora Inicio
							</label>

							<input
								type="time"
								name="startTime"
								value={formData.startTime}
								onChange={handleChange}
								required
								className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#1565D8] focus:outline-none"
							/>
						</div>

						<div>
							<label className="mb-2 block text-sm font-medium text-gray-700">
								Hora Fin
							</label>

							<input
								type="time"
								name="endTime"
								value={formData.endTime}
								onChange={handleChange}
								required
								className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#1565D8] focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Motivo de la Consulta
						</label>

						<textarea
							name="reason"
							rows="4"
							value={formData.reason}
							onChange={handleChange}
							required
							placeholder="Describa brevemente el motivo de la consulta..."
							className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#1565D8] focus:outline-none"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-lg bg-[#1565D8] py-3 font-medium text-white transition hover:bg-[#0f4fb0]"
					>
						Agendar Cita
					</button>
				</form>
			</div>
		</main>
	);
};

export default AgendarCita;