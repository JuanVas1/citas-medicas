# 📋 Reglas de Negocio - Sistema de Citas Médicas

Documentación de las reglas de negocio clave del sistema.

---

## 🎯 Reglas Principales

### 1. ❌ Un paciente NO puede tener 2 citas el mismo día con el mismo doctor

**Descripción:**
- Un mismo paciente no puede agendar múltiples citas con el mismo doctor en el mismo día
- Esto previene duplicados y errores administrativos

**Validación:**
```javascript
// En appointmentController.createAppointment()
// Verificar:
- clientId
- doctorId  
- date (mismo día)
// Si existen, rechazar con error 400
```

**Ejemplo:**
```
❌ RECHAZADO:
- Paciente: Juan García
- Doctor: Dr. López
- Fecha: 2026-06-08
- Hora: 10:00 AM
(Ya tiene cita con Dr. López el 2026-06-08)

✅ PERMITIDO:
- Paciente: Juan García
- Doctor: Dr. López
- Fecha: 2026-06-09
(Diferente día)
```

**Implementación:**
- Modelo: Validación en pre-save hook
- Controller: Verificar antes de crear
- Frontend: Mostrar error "Ya tiene cita con este doctor hoy"

---

### 2. 🔒 No se puede agendar en horario ya ocupado

**Descripción:**
- Dos citas no pueden estar programadas al mismo tiempo
- Un doctor no puede tener citas simultáneas
- Los horarios deben ser únicos por doctor

**Validación:**
```javascript
// En appointmentController.createAppointment()
// Verificar:
- doctorId
- date
- time
- duration (asumiendo 30-60 min)
// Si hay conflicto, rechazar con error 400
```

**Ejemplo:**
```
❌ RECHAZADO:
- Doctor: Dr. López
- Paciente 1: Juan - 2026-06-08 10:00
- Paciente 2: María - 2026-06-08 10:15
(Solapamiento de citas)

✅ PERMITIDO:
- Doctor: Dr. López
- Paciente 1: Juan - 2026-06-08 10:00
- Paciente 2: María - 2026-06-08 10:30
(No hay solapamiento)
```

**Implementación:**
- Duración estándar de cita: 30 minutos
- Validar conflictos de horario
- Frontend: Mostrar horarios disponibles

---

### 3. ⏰ Cancelación solo hasta 24h antes de la cita

**Descripción:**
- Una cita solo puede ser cancelada si faltan al menos 24 horas
- No se permite cancelar con menos de 24 horas de anticipación
- Protege al doctor y evita cancelaciones de último minuto

**Validación:**
```javascript
// En appointmentController.cancelAppointment()
const horasRestantes = fechaCita - fechaAhora
if (horasRestantes < 24) {
  // Rechazar cancelación
  return error 400
}
```

**Ejemplo:**
```
📅 Cita agendada: 2026-06-10 10:00

Hora actual         | Cancelación | Razón
2026-06-08 09:00   | ✅ Permitida | 49 horas para la cita
2026-06-09 09:00   | ✅ Permitida | 25 horas para la cita
2026-06-09 11:00   | ❌ Rechazada| Solo 23 horas para la cita
2026-06-10 10:00   | ❌ Rechazada| La cita está iniciándose
```

**Implementación:**
- Calcular tiempo restante en segundos
- Convertir a horas: `(fechaCita - ahora) / 3600000`
- Validar >= 24 horas (86,400,000 milisegundos)
- Frontend: Mostrar botón deshabilitado si < 24h

---

### 4. 🚫 El doctor NO puede tener citas solapadas

**Descripción:**
- Regla complementaria a la regla #2
- Un doctor específicamente no puede tener 2+ citas al mismo tiempo
- Sistema bloquea automáticamente horarios solapados

**Validación:**
```javascript
// Buscar citas existentes del doctor
const citasExistentes = Appointment.find({
  doctorId: doctorId,
  date: date,
  status: { $ne: 'cancelada' }
})

// Verificar solapamiento de tiempo
for (let cita of citasExistentes) {
  if (tiempoSolapado(cita.time, newTime)) {
    return error 400
  }
}
```

**Ejemplo:**
```
Dr. López - Citas programadas

10:00-10:30 | Paciente A
10:30-11:00 | Paciente B ✅ Sin solapamiento
10:30-10:45 | Paciente C ❌ Solapamiento con B
11:00-11:30 | Paciente D ✅ Sin solapamiento
```

**Implementación:**
- Duración de cita: 30 minutos (configurable)
- Calcular: inicio + 30 min vs. próxima cita
- Validar en controller antes de guardar

---

### 5. 🔐 Solo usuarios autenticados pueden agendar

**Descripción:**
- Requiere JWT válido para crear cita
- Middleware de autenticación verifica token
- No permite acceso anónimo a endpoints de citas

**Validación:**
```javascript
// Middleware: auth.protect()
// Verificar en routes/appointments.js:
router.post('/', auth.protect, appointmentController.createAppointment)

// Rechaza si:
- No hay Authorization header
- Token expirado (> 7 días)
- Token inválido o corrupto
```

**Ejemplo:**
```
❌ RECHAZADO (sin autenticación):
POST /api/appointments
Content-Type: application/json
Body: { doctorId: "...", date: "2026-06-10", ... }
Response: 401 Unauthorized

✅ PERMITIDO (con autenticación):
POST /api/appointments
Authorization: Bearer eyJhbGc...
Content-Type: application/json
Body: { ... }
Response: 201 Created
```

**Implementación:**
- Middleware: `auth.protect` valida JWT
- Token almacenado en `Authorization: Bearer <token>`
- Token válido por 7 días
- Incluir en todas las rutas de citas

---

### 6. 👥 Acceso diferenciado por rol: Admin vs. Paciente

**Descripción:**
- **Admin:** Acceso total a todas las citas
- **Paciente (cliente):** Solo ve sus propias citas
- Control granular de permisos por rol

#### Reglas por rol:

**ADMIN:**
```
GET /api/appointments           ✅ Ver TODAS las citas
GET /api/appointments/:id       ✅ Ver cualquier cita
PUT /api/appointments/:id       ✅ Modificar cualquier cita
DELETE /api/appointments/:id    ✅ Cancelar cualquier cita
POST /api/appointments          ✅ Crear cita para cualquier paciente
```

**CLIENTE:**
```
GET /api/appointments           ✅ Ver sus citas
GET /api/appointments/:id       ✅ Ver si es suya, sino ❌
PUT /api/appointments/:id       ❌ No puede modificar
DELETE /api/appointments/:id    ✅ Cancelar si es suya y > 24h
POST /api/appointments          ✅ Crear cita (solo para sí mismo)
```

**Validación:**
```javascript
// En appointmentController.getAppointments()
if (req.user.role === 'admin') {
  // Retornar todas las citas
  appointments = Appointment.find()
} else if (req.user.role === 'cliente') {
  // Retornar solo citas del usuario
  appointments = Appointment.find({ clientId: req.user.id })
}

// En appointmentController.updateAppointment()
if (req.user.role !== 'admin') {
  return error 403 Forbidden
}

// En appointmentController.cancelAppointment()
if (req.user.role === 'cliente') {
  // Verificar que sea suya
  const appointment = Appointment.findById(id)
  if (appointment.clientId !== req.user.id) {
    return error 403 Forbidden
  }
}
```

**Ejemplo:**

```
Paciente Juan (clientId: 123)

✅ PERMITIDO:
- GET /api/appointments → Ve sus 3 citas
- POST /api/appointments → Agenda cita para sí
- DELETE /api/appointments/456 (si es suya y > 24h)

❌ RECHAZADO:
- GET /api/appointments (admin la ve todas)
- PUT /api/appointments/456 (no puede editar)
- DELETE /api/appointments/999 (no es suya)
- POST /api/appointments (con otro clientId)
```

**Implementación:**
- Middleware: `auth.authorize(['admin', 'cliente'])`
- Validación adicional en controllers
- Queries filtradas por `clientId` para clientes
- Verificación de propiedad antes de modificar

---

## 📊 Matriz de Validaciones

| Regla | Ubicación | Tipo | Crítica |
|-------|-----------|------|---------|
| 1. Sin duplicados mismo día | Controller/Model | Business | ✅ Alta |
| 2. Sin solapamiento horario | Controller | Business | ✅ Alta |
| 3. Cancelación 24h+ | Controller | Business | ✅ Alta |
| 4. Doctor sin solapamiento | Controller | Business | ✅ Alta |
| 5. Autenticación obligatoria | Middleware | Security | ✅ Crítica |
| 6. Acceso por rol | Controller/Middleware | Security | ✅ Crítica |

---

## 🔄 Flujo de Validación de Nueva Cita

```
Usuario intenta agendar cita
    ↓
1. ¿Autenticado? → No → 401 Unauthorized
    ↓ Sí
2. ¿Datos válidos? → No → 400 Bad Request
    ↓ Sí
3. ¿Doctor existe? → No → 404 Not Found
    ↓ Sí
4. ¿Fecha en el futuro? → No → 400 Bad Request
    ↓ Sí
5. ¿Paciente ya tiene cita con este doctor ese día? → Sí → 400 Conflict
    ↓ No
6. ¿Horario disponible (sin solapamiento)? → No → 400 Conflict
    ↓ Sí
7. ¿Doctor activo? → No → 400 Bad Request
    ↓ Sí
8. ✅ CREAR CITA → 201 Created
```

---

## 🔄 Flujo de Validación de Cancelación

```
Usuario intenta cancelar cita
    ↓
1. ¿Autenticado? → No → 401 Unauthorized
    ↓ Sí
2. ¿Cita existe? → No → 404 Not Found
    ↓ Sí
3. Si rol=cliente:
   ¿Es su cita? → No → 403 Forbidden
    ↓ Sí
4. ¿Cita está en futuro? → No → 400 Bad Request
    ↓ Sí
5. ¿Quedan >= 24 horas? → No → 400 Too Late
    ↓ Sí
6. ¿Cita no está ya cancelada? → No → 400 Already Cancelled
    ↓ Sí
7. ✅ CANCELAR CITA (cambiar status a 'cancelada')
```

---

## 💾 Implementación en Base de Datos

### Schema Appointment

```javascript
{
  _id: ObjectId,
  clientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  date: Date,           // 2026-06-10
  time: String,         // "10:00"
  duration: Number,     // 30 (minutos)
  reason: String,
  status: enum [
    'pendiente',
    'confirmada',
    'completada',
    'cancelada'
  ],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Índices Recomendados

```javascript
// Para regla #1: Evitar duplicados mismo día
db.appointments.createIndex({
  clientId: 1,
  doctorId: 1,
  date: 1,
  status: 1
}, { unique: true, partialFilterExpression: { 
  status: { $ne: 'cancelada' } 
}})

// Para regla #2, #4: Búsqueda rápida de solapamientos
db.appointments.createIndex({
  doctorId: 1,
  date: 1,
  status: 1
})

// Para regla #6: Acceso por paciente
db.appointments.createIndex({
  clientId: 1,
  status: 1
})
```

---

## 🧪 Casos de Prueba

### Prueba 1: Duplicado Mismo Día

```javascript
// Setup
const paciente = { id: 'p1', name: 'Juan' }
const doctor = { id: 'd1', name: 'Dr. López' }
const fecha = '2026-06-10'

// Cita 1: OK
POST /api/appointments
{ clientId: 'p1', doctorId: 'd1', date: '2026-06-10', time: '10:00' }
→ 201 Created

// Cita 2: ERROR (duplicado mismo día)
POST /api/appointments
{ clientId: 'p1', doctorId: 'd1', date: '2026-06-10', time: '14:00' }
→ 400 Conflict - "Ya tiene cita con este doctor hoy"
```

### Prueba 2: Solapamiento Horario

```javascript
// Cita 1: OK
POST /api/appointments
{ clientId: 'p1', doctorId: 'd1', date: '2026-06-10', time: '10:00' }
// Duración: 30 min (10:00-10:30)
→ 201 Created

// Cita 2: RECHAZADA (solapamiento)
POST /api/appointments
{ clientId: 'p2', doctorId: 'd1', date: '2026-06-10', time: '10:15' }
// Tiempo 10:15-10:45 solapado con 10:00-10:30
→ 400 Conflict - "Horario no disponible"

// Cita 3: OK (sin solapamiento)
POST /api/appointments
{ clientId: 'p2', doctorId: 'd1', date: '2026-06-10', time: '10:30' }
// Tiempo 10:30-11:00 no solapado
→ 201 Created
```

### Prueba 3: Cancelación 24h

```javascript
// Cita agendada: 2026-06-10 10:00
const appointmentId = 'c1'

// Cancelación OK (49h antes)
// Hora actual: 2026-06-08 09:00
DELETE /api/appointments/c1
→ 200 OK - Cancelada

// Cancelación NO PERMITIDA (23h antes)
// Hora actual: 2026-06-09 11:00
DELETE /api/appointments/c1
→ 400 Bad Request - "No se puede cancelar con menos de 24h"
```

### Prueba 4: Acceso por Rol

```javascript
// Admin (role: 'admin')
GET /api/appointments
→ 200 OK - Retorna TODAS las citas

// Cliente (role: 'cliente', id: 'p1')
GET /api/appointments
→ 200 OK - Retorna solo sus citas

// Cliente intenta ver cita de otro
GET /api/appointments/c2 (no es suya)
→ 403 Forbidden - "No autorizado"
```

---

## 📝 Checklist de Implementación

### Backend (Node.js + Mongoose)

- [ ] **Regla 1:** Validación en controller `createAppointment()`
  - Buscar citas existentes: `clientId + doctorId + date`
  - Rechazar si existe con status ≠ 'cancelada'

- [ ] **Regla 2:** Validación de horarios
  - Función `checkTimeConflict(doctorId, date, time, duration)`
  - Buscar citas solapadas
  - Rechazar si hay conflicto

- [ ] **Regla 3:** Validación en `cancelAppointment()`
  - Calcular horas restantes: `(appointment.date - now) / 3600000`
  - Validar >= 24 horas
  - Cambiar status a 'cancelada'

- [ ] **Regla 4:** Mismo que regla 2 (solapamiento doctor)

- [ ] **Regla 5:** Middleware `auth.protect`
  - Verificar Authorization header
  - Validar JWT
  - Adjuntar usuario a `req.user`

- [ ] **Regla 6:** Middleware y controllers
  - Filtrar en `getAppointments()` por `clientId` si no es admin
  - Verificar propiedad antes de modificar
  - Endpoint authorization

### Frontend (React)

- [ ] **Regla 1:** Mostrar mensaje si ya tiene cita ese día

- [ ] **Regla 2:** Mostrar solo horarios disponibles

- [ ] **Regla 3:** Deshabilitar botón cancelar si < 24h

- [ ] **Regla 5:** Redirect a login si no autenticado

- [ ] **Regla 6:** Mostrar solo citas del usuario

---

## 🚨 Mensajes de Error

| Regla | Código | Mensaje |
|-------|--------|---------|
| 1 | 400 | "Ya tiene una cita con este doctor hoy" |
| 2 | 400 | "Horario no disponible con este doctor" |
| 3 | 400 | "Solo puede cancelar hasta 24h antes de la cita" |
| 4 | 400 | "El doctor tiene otra cita en este horario" |
| 5 | 401 | "Debe estar autenticado" |
| 6 | 403 | "No tiene permiso para acceder a este recurso" |

---

## 📚 Referencias

- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura completa
- [STRUCTURE.md](STRUCTURE.md) - Estructura del código
- Backend: `backend/controllers/appointmentController.js`
- Backend: `backend/middleware/auth.js`
- Backend: `backend/models/Appointment.js`

---

**Documento creado:** Junio 2026
**Versión:** 1.0
**Estado:** Actualizado y completo

⚠️ **NOTA IMPORTANTE:** Estas reglas DEBEN ser implementadas en el código actual si no lo están ya. Consulta [IMPLEMENTACION_STATUS.md](IMPLEMENTACION_STATUS.md) para el análisis de qué está y qué no está implementado.

📊 **Estado actual:** 2 de 6 reglas implementadas
- ✅ Autenticación obligatoria
- ✅ Control de visibilidad por rol
- ❌ Faltan 3 validaciones críticas (4 reglas)
