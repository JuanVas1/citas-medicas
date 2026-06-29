# 📊 Estado de Implementación - Reglas de Negocio

**Última actualización:** Junio 2026

---

## 🎯 Resumen Ejecutivo

| # | Regla | Estado | Ubicación |
|-|-|-|-|
| 1 | Un paciente NO puede 2 citas mismo día/doctor | ✅ Implementada | `cita.controller.js` → `create()` y `rescheduleMine()` |
| 2 | No se puede agendar en horario ocupado | ✅ Implementada | `appointment.service.js` → `findConflicts()` |
| 3 | Cancelación solo 24h antes | ✅ Implementada | `cita.controller.js` → `canPatientModify()` |
| 4 | Doctor NO tiene citas solapadas | ✅ Implementada | `appointment.service.js` → `findConflicts()` |
| 5 | Solo autenticados pueden agendar | ✅ Implementada | `auth.middleware.js` |
| 6 | Admins ven todo; pacientes solo sus citas | ✅ Implementada | `cita.controller.js` + `role.middleware.js` |

**Estado: ✅ 6 de 6 reglas implementadas**

---

## ✅ Detalle de Implementación

### Regla 1: Un paciente NO puede tener 2 citas el mismo día con el mismo doctor

```
Status: ✅ IMPLEMENTADA
Archivo: backend/controllers/cita.controller.js
Funciones: create(), rescheduleMine()
Validación: Busca citas existentes con mismo patientId + doctorId + date + status activo
Respuesta: 409 Conflict - "Ya tiene una cita con este doctor en esta fecha"
Índice DB: { patientId: 1, doctorId: 1, date: 1, status: 1 }
```

**Código:**
```javascript
// En create():
const duplicateExists = await Appointment.findOne({
  patientId: req.user._id,
  doctorId,
  date,
  status: { $in: ['pendiente', 'confirmada'] }
});

// En rescheduleMine():
const duplicateOnNewDate = await Appointment.findOne({
  patientId: req.user._id,
  doctorId: cita.doctorId,
  date,
  status: { $in: ['pendiente', 'confirmada'] },
  _id: { $ne: cita._id }
});
```

---

### Regla 2 y 4: No se puede agendar en horario ocupado / Sin solapamiento

```
Status: ✅ IMPLEMENTADA (cubre Regla 2 y 4)
Archivo: backend/services/appointment.service.js → findConflicts()
Usado en: cita.controller.js → create() y rescheduleMine()
Validación: Busca citas con solapamiento temporal usando startTime < endTime AND endTime > startTime
Respuesta: 409 Conflict - "El bloque horario seleccionado ya esta ocupado"
Índice DB: { doctorId: 1, date: 1, startTime: 1, endTime: 1 }
```

**Código:**
```javascript
// appointment.service.js
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
```

---

### Regla 3: Cancelación solo hasta 24h antes de la cita

```
Status: ✅ IMPLEMENTADA
Archivo: backend/controllers/cita.controller.js
Función: canPatientModify() → usado en cancelMine() y rescheduleMine()
Validación: Calcula horas restantes y rechaza si <= 24 horas
Respuesta: 400 Bad Request - "Solo puedes modificar o cancelar con mas de 24 horas de anticipacion"
Nota: Los administradores pueden cancelar sin restricción de 24h vía cancelByAdmin()
```

**Código:**
```javascript
const canPatientModify = (appointment) => {
  const appointmentDate = toDateTime(appointment.date, appointment.startTime);
  const hoursUntilAppointment = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilAppointment <= 24) {
    return {
      allowed: false,
      reason: 'Solo puedes modificar o cancelar con mas de 24 horas de anticipacion'
    };
  }
  return { allowed: true };
};
```

---

### Regla 5: Autenticación Obligatoria

```
Status: ✅ IMPLEMENTADA
Archivo: backend/middlewares/auth.middleware.js
Validación: JWT token verification en todas las rutas
Rutas protegidas: Todas (/api/citas/*)
```

---

### Regla 6: Control de Visibilidad por Rol

```
Status: ✅ IMPLEMENTADA
Archivos: backend/middlewares/role.middleware.js + backend/controllers/cita.controller.js
Funciones: getMine() (paciente), getAll() (admin), getDoctorAgenda() (doctor), getById() (verificación de propiedad)
```

**Rutas con control de rol:**
```javascript
router.get('/',        authMiddleware, roleMiddleware('administrador'),              getAll);
router.get('/mias',    authMiddleware, roleMiddleware('paciente'),                   getMine);
router.get('/agenda',  authMiddleware, roleMiddleware('doctor'),                     getDoctorAgenda);
router.post('/',       authMiddleware, roleMiddleware('paciente'),                   create);
router.patch('/:id/cancelar',      authMiddleware, roleMiddleware('paciente'),       cancelMine);
router.patch('/:id/cancelar-admin', authMiddleware, roleMiddleware('administrador'), cancelByAdmin);
```

---

## 📊 Índices de Base de Datos

```javascript
// Appointment.js - Índices compuestos
appointmentSchema.index({ doctorId: 1, date: 1, startTime: 1, endTime: 1 });  // Solapamiento
appointmentSchema.index({ patientId: 1, doctorId: 1, date: 1, status: 1 });   // Duplicados
```

---

## 🔄 Flujo Completo de Validación al Crear Cita

```
1. ¿Autenticado? → No → 401 (auth.middleware)
2. ¿Rol paciente? → No → 403 (role.middleware)
3. ¿Campos obligatorios? → No → 400
4. ¿Doctor existe? → No → 404
5. ¿Dentro del horario del doctor (RN-01)? → No → 400
6. ¿Horario libre, sin solapamiento (RN-02/04)? → No → 409
7. ¿Sin duplicado mismo día/doctor (RN-04)? → No → 409
8. ✅ CREAR CITA → 201 con status 'pendiente'
```

## 🔄 Flujo Completo de Validación al Cancelar (Paciente)

```
1. ¿Autenticado? → No → 401
2. ¿Rol paciente? → No → 403
3. ¿Cita existe? → No → 404
4. ¿Es su cita? → No → 403
5. ¿Estado cancelable (pendiente/confirmada)? → No → 400
6. ¿Faltan > 24 horas (RN-03)? → No → 400
7. ✅ CANCELAR → 200
```

---

**Documento actualizado:** Junio 2026  
**Estado: ✅ TODAS LAS REGLAS DE NEGOCIO IMPLEMENTADAS**
