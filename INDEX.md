# 📋 Índice del Proyecto - Sistema de Citas Médicas

## 📁 Estructura

```
proyecto-arqui/
├── backend/              # API REST (Node.js + Express + MongoDB)
├── admin/                # Panel de Administración (React)
├── frontend/             # Frontend Principal (React)
├── README.md             # Documentación principal
├── QUICK_START.md        # Inicio rápido
├── SETUP.md              # Guía de configuración
└── INDEX.md              # Este archivo
```

---

## 🚀 Inicio Rápido

1. **Backend (Terminal 1)**
   ```bash
   cd backend && npm install && npm run dev
   ```

2. **Admin (Terminal 2)**
   ```bash
   cd admin && npm install && npm start
   ```

3. **Client (Terminal 3)**
   ```bash
   cd client && npm install && npm start
   ```

URLs:
- API: `http://localhost:5000`
- Admin: `http://localhost:3000`
- Frontend: `http://localhost:3001`

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| [REGLAS_NEGOCIO.md](REGLAS_NEGOCIO.md) | 📋 Reglas clave del negocio |
| [START_HERE.md](START_HERE.md) | ⭐ Punto de entrada principal |
| [README.md](README.md) | Documentación completa del proyecto |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | Índice de todos los documentos |
| [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md) | Guía de navegación personalizada |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura completa y detallada con diagramas |
| [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) | Arquitectura simplificada con ASCII diagrams |
| [STRUCTURE.md](STRUCTURE.md) | Estructura de carpetas y archivos detallada |
| [QUICK_START.md](QUICK_START.md) | Guía rápida de inicio |
| [SETUP.md](SETUP.md) | Instrucciones de configuración |
| [ROADMAP.md](ROADMAP.md) | Futuro del proyecto y features planeadas |
| [INDEX.md](INDEX.md) | Este archivo |

---

## 🏛️ Arquitectura

El sistema está diseñado con una arquitectura de **3 capas**:

```
┌──────────────┐         ┌──────────────┐
│ Admin Panel  │         │ Frontend   │
│   (React)    │         │   (React)    │
└──────┬───────┘         └──────┬───────┘
       └────────────┬───────────┘
                    │ HTTP/JWT
                    ▼
            ┌──────────────────┐
            │  Backend API     │
            │ (Express.js)     │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │    MongoDB       │
            │   (Database)     │
            └──────────────────┘
```

**Características:**
- ✅ REST API con Express
- ✅ Autenticación JWT
- ✅ MongoDB con Mongoose
- ✅ Encriptación bcrypt
- ✅ CORS habilitado

Para más detalles:
- Arquitectura completa: [ARCHITECTURE.md](ARCHITECTURE.md)
- Versión simplificada: [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md)

---

## 🗂️ Estructura de Carpetas

### Backend (`/backend`)
```
backend/
├── models/              # Esquemas MongoDB
│   ├── User.js
│   ├── Doctor.js
│   └── Appointment.js
├── routes/              # Rutas API
│   ├── auth.js
│   ├── appointments.js
│   ├── doctors.js
│   └── users.js
├── controllers/         # Lógica de negocio
│   ├── authController.js
│   ├── appointmentController.js
│   └── doctorController.js
├── middleware/          # Middleware
│   └── auth.js         # Autenticación JWT
├── config/              # Configuraciones
├── server.js            # Servidor principal
├── package.json
├── .env.example
└── .gitignore
```

### Admin Panel (`/admin`)
```
admin/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.js    # Panel principal admin
│   │   └── Login.js              # Login admin
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   └── App.css
│   ├── api.js           # Configuración Axios
│   ├── services.js      # Servicios API
│   ├── App.js           # Componente raíz
│   └── index.js         # Punto de entrada
├── public/
│   └── index.html
├── package.json
├── .gitignore
└── README.md
```

### Frontend (`/frontend`)
```
client/
├── src/
│   ├── components/
│   │   ├── Dashboard.js   # Dashboard usuario
│   │   ├── Login.js              # Login usuario
│   │   └── Register.js           # Registro usuario
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   └── App.css
│   ├── api.js           # Configuración Axios
│   ├── services.js      # Servicios API
│   ├── App.js           # Componente raíz
│   └── index.js         # Punto de entrada
├── public/
│   └── index.html
├── package.json
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register     - Registrar usuario
POST   /api/auth/login        - Iniciar sesión
GET    /api/auth/me           - Obtener usuario actual
```

### Citas
```
GET    /api/appointments      - Obtener todas las citas
POST   /api/appointments      - Crear nueva cita
PUT    /api/appointments/:id  - Actualizar cita
PATCH  /api/appointments/:id/cancel - Cancelar cita
```

### Doctores
```
GET    /api/doctors           - Obtener todos los doctores
GET    /api/doctors/:id       - Obtener doctor específico
POST   /api/doctors           - Crear doctor (admin)
PUT    /api/doctors/:id       - Actualizar doctor (admin)
DELETE /api/doctors/:id       - Eliminar doctor (admin)
```

---

## 👥 Credenciales de Prueba

### Administrador
- **Email:** admin@example.com
- **Contraseña:** admin123
- **Rol:** admin

### Usuario
- **Email:** usuario@example.com
- **Contraseña:** usuario123
- **Rol:** usuario

---

## 📱 Funcionalidades por Panel

### 👤 Panel de Usuario
- ✅ Registro e inicio de sesión
- ✅ Ver lista de doctores disponibles
- ✅ Agendar nuevas citas
- ✅ Ver historial de citas
- ✅ Cancelar citas
- ✅ Ver estado de citas en tiempo real

### 👨‍⚕️ Panel de Administrador
- ✅ Autenticación segura (solo admin)
- ✅ Ver todas las citas
- ✅ Confirmar citas
- ✅ Marcar citas como completadas
- ✅ Cancelar citas
- ✅ Gestionar doctores (crear, editar, desactivar)
- ✅ Ver información de pacientes
- ✅ Estadísticas de citas

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología |
|-----------|-----------|
| **Backend** | Node.js, Express.js |
| **Base de Datos** | MongoDB, Mongoose |
| **Frontend Admin** | React 18, Axios, CSS3 |
| **Frontend Usuario** | React 18, Axios, CSS3 |
| **Autenticación** | JWT (JSON Web Tokens) |
| **Seguridad** | Bcrypt (encriptación) |

---

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación con JWT
- Middleware de protección en rutas admin
- Validación de datos en servidor

---

## 📝 Variables de Entorno

### Backend (`.env`)
```
MONGODB_URI=mongodb://localhost:27017/citas_medicas
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
NODE_ENV=development
PORT=5000
```

---

## 🚦 Estados de Citas

- **Pendiente** ⏳ - Cita creada, esperando confirmación del admin
- **Confirmada** ✅ - Admin confirmó la cita
- **Completada** ✔️ - Cita fue realizada
- **Cancelada** ✕ - Cita fue cancelada

---

## 📈 Próximas Mejoras

- [ ] Notificaciones por email
- [ ] Recordatorios de citas
- [ ] Sistema de calificación de doctores
- [ ] Exportación de reportes PDF
- [ ] Integración con calendario
- [ ] SMS notifications
- [ ] Disponibilidad automática de horarios

---

## 🆘 Soporte

Para problemas o preguntas, consulta:
- [QUICK_START.md](QUICK_START.md) - Troubleshooting
- [README.md](README.md) - Documentación completa

---

## 📄 Licencia

ISC

---

**Última actualización:** 2026-06-08
