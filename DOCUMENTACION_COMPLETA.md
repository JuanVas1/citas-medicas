 DOCUMENTACION DEL PROYECTO READ ME:
 Sistema de Gestión de Citas Hospitalarias 
Un sistema web que digitaliza y automatiza el ciclo completo de atención ambulatoria de un hospital: desde la disponibilidad de consultorios y doctores, hasta el agendamiento, confirmación, modificación, cancelación y avisos de citas médicas, con roles diferenciados para pacientes, médicos y administradores.

Problemática:
Los centros de atención médica ambulatoria e institucional enfrentan serios desafíos operativos debido a la falta de sistemas centralizados de sincronización en tiempo real. Esta carencia tecnológica genera una serie de ineficiencias operacionales y administrativas críticas:
•  Solapamiento de horarios: Asignación descontrolada de múltiples citas a un mismo médico en bloques temporales idénticos o que colisionan con la duración estándar del servicio, afectando la calidad de atención.
•  Ausencia de Autogestión Autónoma: Dependencia exclusiva de canales telefónicos o manuales para la reserva y cancelación, lo que aumenta la tasa de inasistencia (no-show) al no existir mecanismos para que los pacientes liberen cupos de manera oportuna.
•  Vulnerabilidad e Inconsistencia de Datos: Almacenamiento ineficiente de credenciales y falta de control de accesos granular que expone tanto los datos sensibles de los pacientes como los registros operacionales de la clínica.
•  Sobrecarga Administrativa: Personal clínico y de recepción dedicando tiempo crítico a la coordinación de agendas manuales, en lugar de concentrarse en la atención al paciente y tareas estratégicas.




Objetivos

    Objetivo General
Desarrollar una plataforma distribuida y robusta de Gestión de Citas Hospitalarias aplicando Spec-Driven Development (SDD), donde cada componente del sistema desde la arquitectura hasta el código  es trazable a una especificación formal previa, automatizando el ciclo completo de atención ambulatoria y reduciendo en un 85% el tiempo promedio de agendamiento respecto al proceso manual actual.

     Objetivos Específicos
Garantizar la integridad de la base de datos mediante la aplicación estricta de validaciones de concurrencia e índices compuestos, eliminando el 100% de los solapamientos horarios.
Desarrollar un portal web para pacientes que permite agendar, modificar y cancelar citas de forma autónoma, reduciendo la dependencia de canales presenciales o telefónicos en un 70% y disminuyendo el tiempo de agendamiento de 15 minutos (ventanilla) a menos de 2 minutos (online). 
Desarrollar un Portal de Clientes interactivo enfocado en la usabilidad que permite agendar, consultar y cancelar citas bajo reglas estrictas de negocio.
Construir un panel de administración con visibilidad en tiempo real del estado de todas las citas, consultorios y doctores activos, reduciendo el tiempo de gestión administrativa diaria en un 60% mediante dashboards con filtros por especialidad, estado y fecha. 
Implementar autenticación sin estado mediante JWT y control de acceso basado en roles (RBAC) con 3 niveles diferenciados (paciente, doctor, administrador), garantizando que 0 endpoints críticos sean accesibles sin autorización válida. 
Implementar un sistema de avisos y recordatorios automáticos que disminuya la tasa de inasistencia sin aviso del estimado actual de 35% a menos del 10%, liberando cupos para reasignación en tiempo real. 
Alcance


El alcance técnico y funcional del sistema está estrictamente delimitado para asegurar una implementación estructurada, enfocada y de alta calidad para la gestión de citas.
Tabla 1
Matriz de Alcance (In-Scope vs Out-of-Scope)

Elementos Incluidos en el Alcance (In-Scope) 
Elementos Excluidos en el Alcance (Out-of-Scope) 
Módulo de registro y autenticación segura con hasheo criptográfico Bcrypt.
Portal del Paciente con catálogo interactivo de médicos filtrable por especialidades.
Motor de agendamiento con validaciones lógicas automáticas de fecha, hora y solapamiento.
Flujo multiestado de citas ('pendiente', 'confirmada', 'completada', 'cancelada') controlado por el administrador.
La gestión de doctores y sus horarios de atención, definiendo los bloques de tiempo disponibles por especialidad y consultorio asignado. 
Un sistema de avisos automáticos por correo electrónico para confirmaciones de cita, recordatorios 24 horas antes y notificaciones de cancelación o cambio. 
Procesamiento de facturación e integración con pasarelas de pago de coaseguros o consultas particulares.
Módulo de Historia Clínica Electrónica avanzada o gestión de recetas digitales interconectadas (HL7 / FHIR).
Gestión física de inventarios de farmacia, medicamentos o asignación de camas de hospitalización.




 
 
 

Arquitectura Propuesta

El sistema implementa un patrón arquitectónico de Tres Capas (Layers), completamente desacoplado e interconectado por protocolos estandarizados (HTTP REST). Esta arquitectura monolítica está diseñada con preparación para escalabilidad horizontal.

Capa de Presentación
Son las 3 aplicaciones React que el usuario ve y con las que interactúa directamente. Cada una es independiente, corre en su propio puerto y solo conoce los endpoints que le corresponden según el rol.
Portal del Paciente en puerto 3001 — permite registrarse, buscar doctores, agendar citas, ver su historial y cancelar dentro del plazo permitido.
Portal del Doctor en puerto 3002 — permite ver su agenda del día y semana, revisar el detalle de cada cita y agregar notas a la consulta.
Panel del Administrador en puerto 3000 — gestión completa de doctores, consultorios, horarios, citas y estadísticas globales del hospital.

esto a

⬇ (Peticiones HTTP REST + JWT)


Capa de Lógica de Negocio ( Backend API RESTful)
Servidor Node.js con Express que expone una API REST centralizada en el puerto 5000. Actúa como núcleo exponiendo servicios HTTP, aplicando middlewares de seguridad y procesando transacciones del negocio. 

esto a

⬇ (MongoDB ODM)


Capa de Persistencia de Datos (Base de Datos NoSQL)
MongoDB almacena toda la información del sistema en colecciones documentales e integridad referencial, asegurando con índices compuestos para bloquear colisiones lógicas.

 Requisitos Funcionales
Tabla 2
Especificación Detallada de Requisitos Funcionales (RF)

Código
Denominación
Descripción Técnica Detallada
RF-01
Registro y Autenticación con Roles
El sistema debe permitir el registro de pacientes y la autenticación de los tres tipos de usuario (paciente, doctor, administrador) mediante email y contraseña. 
RF-02
Gestión de Consultorios y Doctores
El administrador debe poder registrar, editar, listar y desactivar consultorios (número, piso, especialidad) y doctores (nombre, especialidad, email, teléfono, consultorio asignado). Al registrar un doctor, el sistema genera automáticamente su cuenta de acceso con rol 'doctor'.
RF-03
Gestión de Horarios por Doctor
El administrador debe poder definir los bloques de atención disponibles por doctor, especificando día, hora de inicio y hora de fin. Cada bloque tiene una duración estándar de 30 minutos y sirve como base para el motor de disponibilidad.
RF-04
Consulta de Disponibilidad en Tiempo Real
El paciente autenticado debe poder buscar doctores filtrando por especialidad y al seleccionar uno con una fecha determinada, el sistema muestra únicamente los bloques horarios libres, excluyendo los ya ocupados o bloqueados por el sistema.
RF-05
Agendamiento de Cita
El paciente autenticado debe poder reservar una cita seleccionando doctor, fecha, bloque horario disponible y motivo de consulta. El sistema valida disponibilidad, asigna el consultorio correspondiente y registra la cita con estado inicial 'pendiente'.
RF-06
Modificación y Cancelación de Cita por Paciente
El paciente puede reprogramar o cancelar una cita propia únicamente si su estado es 'pendiente' o 'confirmada' y faltan más de 24 horas para la fecha agendada. Ante cualquier cambio, el sistema libera el bloque horario y notifica por email al doctor y administrador.
RF-07
Gestión de Estados de Cita por Administrador
El administrador puede cambiar el estado de cualquier cita del sistema (pendiente → confirmada → completada / cancelada), ingresando un motivo obligatorio en caso de cancelación. Cada cambio de estado queda registrado con timestamp y actor responsable.
RF-08
Agenda del Doctor
El doctor autenticado debe visualizar su agenda de citas del día y la semana con detalle completo: nombre del paciente, motivo de consulta, hora y consultorio asignado, con indicador visual del estado actual de cada cita.
RF-09
Historial Trazable de Citas del Paciente
El paciente debe poder consultar el historial completo de sus citas con todos los estados por los que transitó cada una, fecha de cada cambio y actor responsable, garantizando trazabilidad total del ciclo de vida de la cita.
RF-10
Notificaciones y Recordatorios por Email
El sistema debe enviar emails automáticos en tres momentos: al confirmar una cita, como recordatorio 24 horas antes de la consulta y ante cualquier modificación o cancelación, notifican

 cus Del Paciente:

CU-01 Registrarse en el sistema (RF-01)
CU-02 Iniciar sesión (RF-01)
CU-03 Consultar disponibilidad de doctores (RF-04)
CU-04 Agendar una cita médica (RF-05) ⭐
CU-05 Modificar una cita (RF-06)
CU-06 Cancelar una cita (RF-06)
CU-07 Ver historial de citas (RF-09)

Del Doctor:

CU-08 Ver agenda del día y semana (RF-08)
CU-09 Ver detalle de una cita (RF-08)

Del Administrador:

CU-10 Gestionar consultorios y doctores (RF-02)
CU-11 Gestionar horarios (RF-03)
CU-12 Confirmar o cancelar citas (RF-07)
CU-13 Ver dashboard y estadísticas (RF-07)

Sistema automático:
CU-14 Enviar recordatorio (RF-10)⭐️ los q tienen estrellita si espeficar por q son los importantes

Contratos API

       Acuerdo formal y previo que define exactamente cómo se comunican el frontend y el backend. El contrato especifica qué datos entran, qué datos salen y qué errores pueden ocurrir en cada operación del sistema. 
CONTRATO 1 - Autenticación de Usuario
Permite autenticar a los usuarios del sistema (pacientes, médicos y administradores). El servicio recibe las credenciales de acceso proporcionadas por el usuario y valida su autenticidad. 
Método: HTTP: POST
Endpoint:/api/auth/login
Rol: Público (no requiere autenticación previa)
Headers:
Content-Type: application/json
Request Body:
{
 "email": "paciente@gmail.com",
 "password": "123456"
}
Respuesta Exitosa (200 OK):
{
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 "usuario": {
   "id": "64abc123",
   "nombre": "Juan Pérez",
   "email": "paciente@gmail.com",
   "rol": "paciente"
 }
}
Respuesta de Error (401 Unauthorized):
{
 "error": "Email o contraseña incorrectos"
}
Respuesta de Error (400 Bad Request):
{
 "error": "Email y contraseña son obligatorios"
}

CONTRATO 2 - Agendamiento de Cita 
Permite a un paciente registrar una nueva cita médica seleccionando un médico y un horario disponible. 
Método HTTP: POST
Endpoint: /api/citas
Rol autorizado: Paciente
Headers:
Content-Type: application/json
Authorization: Bearer <token JWT>
Request Body:
{
  "doctorId": "64doc456",
  "fecha": "2026-07-10",
  "horaInicio": "09:00",
  "motivo": "Dolor de cabeza persistente"
}
Respuesta Exitosa (201 Created):
{
  "id": "64cita789",
  "paciente": "Juan Pérez",
  "doctor": "Dra. María López",
  "especialidad": "Neurología",
  "consultorio": "Piso 2 - Consultorio 204",
  "fecha": "2026-07-10",
  "horaInicio": "09:00",
  "horaFin": "09:30",
  "motivo": "Dolor de cabeza persistente",
  "estado": "pendiente",
  "creadoEn": "2026-06-13T10:00:00Z"
}
Posibles errores:
409 Conflict
{
  "error": "El bloque horario seleccionado ya está ocupado"
}
400 Bad Request
{
  "error": "No se pueden agendar citas en fechas pasadas o días no laborables"
}
401 Unauthorized
{
  "error": "Token JWT inválido o expirado"
}
403 Forbidden
{
  "error": "Solo los pacientes pueden agendar citas"
}





