# Implementación SDD para el Sistema de Gestión de Citas Médicas

## 1. Objetivo del enfoque SDD

Aplicar Spec-Driven Development (SDD) significa que cada capa del sistema parte de una especificación explícita antes de escribir la lógica de negocio. En este proyecto, la especificación define:

- Reglas funcionales del negocio.
- Contratos de API.
- Modelos de datos.
- Reglas de autorización y validación.
- Casos de prueba esperados.

La idea es que el código, la arquitectura y la documentación estén trazados a los requisitos del documento base.

---

## 2. Arquitectura propuesta

### 2.1 Visión general

El sistema se organiza como una arquitectura monolítica modular con frontend separado y backend centralizado.

```text
Frontend (React)
   ├─ Admin Panel
   ├─ Doctor Portal
   └─ Patient Portal
            │
            │ HTTP/REST + JWT
            ▼
Backend API (Node.js + Express)
   ├─ Auth
   ├─ Appointments
   ├─ Doctors
   ├─ Notifications
   └─ Reports
            │
            │ MongoDB / Mongoose
            ▼
Persistencia (MongoDB)
```

### 2.2 Capa de presentación

- Admin panel: gestión de doctores, consultorios, horarios, citas y estadísticas.
- Portal del paciente: registro, login, búsqueda de doctores, agendamiento y consulta de historial.
- Portal del doctor: visualización de agenda y detalles de citas.

### 2.3 Capa de aplicación

El backend expone endpoints REST versionados y contract-first.

### 2.4 Capa de dominio

Incluye reglas de negocio críticas:

- Validación de no solapamiento.
- Restricción de horarios.
- Control de cambios de estado.
- Reglas de cancelación según tiempo restante.
- Log de trazabilidad por cita.

### 2.5 Capa de infraestructura

- MongoDB como base de datos documental.
- JWT para autenticación.
- Middleware para autorización por roles.
- Servicios de email para recordatorios y notificaciones.

---

## 3. Estructura sugerida del proyecto

```text
project/
├─ docs/
│  ├─ specs/
│  │  ├─ auth.spec.md
│  │  ├─ appointments.spec.md
│  │  ├─ doctors.spec.md
│  │  └─ notifications.spec.md
│  └─ architecture/
│     └─ system-architecture.md
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ app.js
│  └─ tests/
├─ admin/
├─ doctor/
└─ patient/
```

---

## 4. Especificaciones clave que deben guiar el desarrollo

### RF-01: Registro y autenticación

- El sistema permite registrar pacientes y autenticar usuarios por email y contraseña.
- Se deben gestionar roles: paciente, doctor y administrador.

### RF-02: Gestión de consultorios y doctores

- El administrador crea, edita y desactiva consultorios y doctores.
- Al crear un doctor, debe generarse su acceso con el rol correspondiente.

### RF-03: Gestión de horarios

- Los horarios deben ser bloques de 30 minutos.
- No deben existir conflictos entre bloques del mismo doctor.

### RF-04: Disponibilidad en tiempo real

- El sistema debe mostrar únicamente horarios libres y válidos.

### RF-05: Agendamiento

- Se valida doctor, fecha, horario y consultorio.
- La cita se crea con estado inicial pendiente.

### RF-06: Modificación y cancelación

- La modificación o cancelación debe respetar reglas de tiempo y estado.

### RF-07: Estados de cita

- Los cambios de estado deben quedar registrados con actor y timestamp.

### RF-08 y RF-09

- El doctor revisa su agenda.
- El paciente consulta su historial trazable.

### RF-10: Recordatorios

- Envío de correos automáticos para confirmación, recordatorio y cancelación.

---

## 5. Metodología de desarrollo SDD

### Fase 1: Definir la especificación

Cada caso de uso debe estar documentado con:

- objetivo,
- actores,
- precondiciones,
- flujo principal,
- excepciones,
- respuesta esperada.

### Fase 2: Definir contratos API

Antes de desarrollar, se deben fijar los contratos JSON para:

- login,
- creación de citas,
- listado de doctores,
- actualización de estado,
- historial del paciente.

### Fase 3: Crear pruebas base

Se recomienda usar pruebas de integración para validar:

- autenticación,
- asignación de cita,
- validación de horarios,
- control de roles.

### Fase 4: Implementar la lógica

El desarrollo debe respetar la separación:

- rutas → validan entradas,
- controladores → coordinan la operación,
- servicios → encapsulan la lógica de negocio,
- modelos → persistencia.

### Fase 5: Verificación continua

Cada funcionalidad debe comprobarse con:

- pruebas unitarias,
- pruebas de integración,
- revisión del contrato API.

---

## 6. Diseño de capas recomendadas

### Presentación

- React para cada portal.
- State management simple con hooks/context.
- Consumo de API mediante Axios.

### Aplicación

- Express con middlewares globales.
- Rutas agrupadas por recurso.

### Dominio

- Servicios para disponibilidad, cita, autenticación y trazabilidad.

### Persistencia

- Schemas de MongoDB con índices para las búsquedas frecuentes.

---

## 7. Reglas técnicas que deben cumplirse

- Toda operación crítica debe validar el rol del usuario.
- Todo cambio de estado debe dejar auditoría.
- Las fechas deben manejarse en UTC donde sea posible.
- Las respuestas de error deben ser consistentes.
- Los endpoints deben devolver mensajes claros y códigos HTTP correctos.

---

## 8. Plan de desarrollo recomendado

### Fase 1: infraestructura base

- configuración del backend,
- conexión a MongoDB,
- variables de entorno,
- JWT.

### Fase 2: autenticación y roles

- registro,
- login,
- middleware de autorización.

### Fase 3: gestión de doctores y horarios

- CRUD de doctores,
- CRUD de consultorios,
- creación de bloques horarios.

### Fase 4: motor de citas

- disponibilidad,
- agendamiento,
- reprogramación,
- cancelación.

### Fase 5: trazabilidad y notificaciones

- historial de cambios,
- emails de confirmación y recordatorios.

### Fase 6: frontend y dashboards

- pantallas por rol,
- dashboard administrativo,
- agenda del doctor,
- portal paciente.

---

## 9. Conclusión

La implementación correcta del sistema debe partir de especificaciones claras y contract-first. El desarrollo SDD garantiza que la arquitectura, la lógica de negocio y la experiencia de usuario estén alineadas con los requisitos del documento original.

Este enfoque reduce ambigüedad, facilita la trazabilidad y permite desarrollar el sistema con mayor seguridad y mantenibilidad.