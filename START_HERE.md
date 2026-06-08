# 🚀 START HERE

Bienvenido al **Sistema de Citas Médicas**. Elige una opción:

---

## ⏱️ Tengo 5 minutos

Quiero ver el sistema funcionando ahora.

→ Ve a [QUICK_START.md](QUICK_START.md) y sigue los 3 pasos.

```bash
cd backend && npm install && npm run dev
cd admin && npm install && npm start
cd frontend && npm install && npm start
```

---

## 🎓 Tengo 30 minutos

Quiero entender cómo funciona.

1. Lee [README.md](README.md) - 5 min
2. Lee [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) - 10 min
3. Ejecuta el sistema (ver arriba) - 5 min
4. Prueba login como admin y cliente - 10 min

---

## 📖 Tengo más tiempo

Quiero ser experto en este proyecto.

→ Ve a [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md) y elige tu camino.

---

## 📁 Estructura Rápida

```
.
├── backend/    🖥️  Servidor Node.js
├── admin/      👨‍💼 Panel Administrador
├── client/     👤 Portal Cliente
└── docs/       📚 Documentación
```

---

## 🔐 Credenciales de Prueba

**Admin:**
```
Email: admin@medical.com
Password: admin123
```

**Cliente:**
```
Email: cliente@medical.com
Password: cliente123
```

---

## 🌐 URLs

| Aplicación | URL | Puerto |
|-----------|-----|--------|
| Admin Panel | http://localhost:3000 | 3000 |
| Frontend | http://localhost:3001 | 3001 |
| Backend API | http://localhost:5000 | 5000 |

---

## ❓ ¿Necesitas ayuda?

- **No funciona nada:** [QUICK_START.md](QUICK_START.md#troubleshooting)
- **Quiero saber cómo funciona:** [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md)
- **Quiero modificar código:** [STRUCTURE.md](STRUCTURE.md)
- **Tengo otras preguntas:** [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)

---

## ✅ Checklist Rápido

- [ ] Cloné/descargué el proyecto
- [ ] Tengo Node.js v14+ instalado
- [ ] Tengo MongoDB (local o Atlas)
- [ ] Ejecuté `npm install` en las 3 carpetas
- [ ] Ejecuté `npm run dev` (backend) y `npm start` (admin/client)
- [ ] Abrí http://localhost:3000 (admin)
- [ ] Hice login con las credenciales

---

## 📋 Reglas de Negocio Importantes

Antes de usar el sistema, conoce las reglas clave:
- ❌ Un paciente no puede tener 2 citas el mismo día con el mismo doctor
- 🔒 No se puede agendar en horario ya ocupado
- ⏰ Cancelación solo hasta 24h antes de la cita
- 🚫 El doctor no puede tener citas solapadas
- 🔐 Solo usuarios autenticados pueden agendar
- 👥 Admins ven todo; pacientes solo sus citas

→ Lee [REGLAS_NEGOCIO.md](REGLAS_NEGOCIO.md) para detalles completos

---

**¡Listo!** Ahora puedes explorar el sistema.

Si tienes problemas, consulta la documentación o revisa el archivo de [QUICK_START.md](QUICK_START.md#troubleshooting).
