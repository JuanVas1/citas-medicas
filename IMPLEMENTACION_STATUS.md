# 📊 Estado de Implementación - Reglas de Negocio

**Análisis completado:** Junio 2026

---

## 🎯 Resumen Ejecutivo

| # | Regla | Estado | Prioridad |
|-|-|-|-|
| 1 | Un paciente NO puede 2 citas mismo día/doctor | ❌ Faltante | 🔴 CRÍTICA |
| 2 | No se puede agendar en horario ocupado | ❌ Faltante | 🔴 CRÍTICA |
| 3 | Cancelación solo 24h antes | ❌ Faltante | 🔴 CRÍTICA |
| 4 | Doctor NO tiene citas solapadas | ❌ Faltante* | 🔴 CRÍTICA |
| 5 | Solo autenticados pueden agendar | ✅ Implementada | ✅ OK |
| 6 | Admins ven todo; pacientes solo sus citas | ✅ Implementada | ✅ OK |

**Nota:** Regla 4 = Regla 2 (misma validación)

---

## ✅ Implementadas (2 de 6)

### Regla 5: Autenticación Obligatoria
```
Status: ✅ IMPLEMENTADA
Archivo: backend/middleware/auth.js
Función: protect()
Validación: JWT token verification
Rutas protegidas: Todas (/api/appointments/*)
```

### Regla 6: Control de Visibilidad
```
Status: ✅ IMPLEMENTADA  
Archivo: backend/controllers/appointmentController.js
Función: getAppointments()
Línea: 36-37
Código: if (req.user.role === 'cliente') { query.clientId = req.user._id; }
```

---

## ❌ Faltantes (4 de 6, siendo 2 duplicadas = 3 Validaciones)

### Faltante 1: No Duplicados Mismo Día
```
Status: ❌ NO IMPLEMENTADA
Archivo: backend/controllers/appointmentController.js
Función: createAppointment()
Acción requerida: Agregar validación antes de crear
```

**Pseudocódigo:**
```javascript
1. Obtener fecha de la cita
2. Buscar en BD:
   - clientId = usuario actual
   - doctorId = doctor seleccionado
   - date = mismo día
   - status != 'cancelada'
3. Si existe → Rechazar (409 Conflict)
4. Si no existe → Continuar creación
```

---

### Faltante 2 & 4: Sin Solapamiento Horario
```
Status: ❌ NO IMPLEMENTADA (cubre Regla 2 y 4)
Archivo: backend/controllers/appointmentController.js
Función: createAppointment()
Acción requerida: Agregar validación antes de crear
```

**Pseudocódigo:**
```javascript
1. Obtener horario de cita (date + time)
2. Asignar duración estándar: 30 minutos
3. Buscar en BD:
   - doctorId = doctor seleccionado
   - date = mismo día
   - status != 'cancelada'
4. Para cada cita existente:
   - Verificar si hay solapamiento temporal
   - Si time_nueva >= time_existente 
     AND time_nueva < time_existente + 30min
     → Hay solapamiento
5. Si hay solapamiento → Rechazar (409 Conflict)
6. Si no → Continuar creación
```

---

### Faltante 3: Cancelación con 24h Límite
```
Status: ❌ NO IMPLEMENTADA
Archivo: backend/controllers/appointmentController.js
Función: cancelAppointment()
Acción requerida: Agregar validación antes de cancelar
```

**Pseudocódigo:**
```javascript
1. Obtener cita por ID
2. Calcular tiempo restante:
   - horasRestantes = (cita.date - ahora) / 3600000
3. Si horasRestantes < 24:
   - Rechazar (400 Bad Request)
   - Mensaje: "No puedes cancelar con menos de 24h"
4. Si >= 24 horas:
   - Cambiar status = 'cancelada'
   - Guardar en BD
```

---

## 🛠️ Cambios Requeridos

### Archivo: `backend/controllers/appointmentController.js`

**Cambios en `createAppointment()`:**
- Agregar validación de duplicados (Regla 1)
- Agregar validación de horario (Reglas 2 & 4)
- Ambas antes del `.save()`

**Cambios en `cancelAppointment()`:**
- Agregar validación de 24 horas (Regla 3)
- Antes de cambiar status

---

## 📈 Impacto de Implementación

| Aspecto | Impacto |
|--------|--------|
| **Seguridad de datos** | 🟢 Alto - Evita duplicados |
| **UX Doctor** | 🟢 Alto - Evita conflictos horarios |
| **UX Paciente** | 🟢 Medio - Protege cancelaciones tardías |
| **Complejidad** | 🟡 Baja - 3 validaciones simples |
| **Performance** | 🟡 Bajo - 3 queries adicionales |
| **Testing** | 🟠 Medio - Requiere test cases |

---

## 📋 Checklist de Implementación

### Antes de Implementar
- [ ] Revisar `backend/controllers/appointmentController.js`
- [ ] Revisar `backend/models/Appointment.js`
- [ ] Backup de archivos actuales

### Implementación
- [ ] Agregar validación de duplicados
- [ ] Agregar validación de horario
- [ ] Agregar validación de 24h cancelación

### Testing
- [ ] Prueba: No permite 2 citas mismo día
- [ ] Prueba: No permite horario ocupado
- [ ] Prueba: No permite cancelación < 24h
- [ ] Prueba: Permite cancelación >= 24h
- [ ] Prueba: Admins pueden cancelar siempre (verificar)

### Documentación
- [ ] Actualizar README con restricciones
- [ ] Actualizar comentarios en código
- [ ] Actualizar errores esperados en API

---

## 🎯 Próximos Pasos

**Opción 1: Implementación Automática**
```
¿Deseas que implemente los cambios automáticamente?
Tiempo estimado: 15-20 minutos
Cambios: 3 validaciones en appointmentController.js
```

**Opción 2: Revisión Manual**
```
Revisar código sugerido y hacerlo manualmente
Tiempo estimado: 30-40 minutos
Beneficio: Control total de cambios
```

**Opción 3: Implementación Parcial**
```
¿Qué reglas quieres implementar primero?
- Solo Regla 1 (duplicados)
- Solo Reglas 2&4 (horario)
- Solo Regla 3 (24h cancelación)
```

---

## 📞 Decisión Requerida

**¿Quieres que implemente estas 3 validaciones ahora en el código?**

- [ ] Sí, implementa todas las 3
- [ ] Sí, pero primero solo la Regla 1 (duplicados)
- [ ] Sí, pero primero solo Reglas 2&4 (horario)
- [ ] Sí, pero primero solo la Regla 3 (24h)
- [ ] No, prefiero hacerlo manualmente
- [ ] No, necesito más información

---

**Documento de análisis:** REGLAS_NEGOCIO.md
**Detalles de código:** Reporte completo en subagent result
**Próxima acción:** Esperando tu decisión
