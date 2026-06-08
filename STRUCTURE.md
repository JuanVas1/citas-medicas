# 📁 Estructura del Proyecto

## Carpetas Principales

```
proyecto arqui/
├── backend/                    # 🖥️ Servidor Node.js + Express
├── admin/                      # 👨‍💼 Panel Administrador (React)
├── frontend/                   # 🖧 Frontend Principal (React)
│
├── README.md                   # Documentación principal
├── INDEX.md                    # Índice del proyecto
├── ARCHITECTURE.md             # Arquitectura detallada
├── ARCHITECTURE_SIMPLE.md      # Arquitectura simplificada
├── SETUP.md                    # Instrucciones de setup
├── QUICK_START.md              # Guía rápida
└── STRUCTURE.md                # Este archivo
```

---

## 🖥️ Backend (`backend/`)

```
backend/
├── package.json                # Dependencias
├── .env.example               # Variables de entorno (ejemplo)
├── server.js                  # Entrada principal
├── config/
│   └── database.js            # Configuración MongoDB
├── models/                    # Esquemas Mongoose
│   ├── User.js               # Schema de usuarios
│   ├── Doctor.js             # Schema de doctores
│   └── Appointment.js        # Schema de citas
├── routes/                    # Rutas Express
│   ├── auth.js               # Rutas de autenticación
│   ├── appointments.js       # Rutas de citas
│   └── doctors.js            # Rutas de doctores
├── controllers/               # Lógica de negocio
│   ├── authController.js     # Login, registro
│   ├── appointmentController.js
│   └── doctorController.js
├── middleware/               # Funciones middleware
│   └── auth.js              # JWT validation
└── utils/
    └── errorHandler.js      # Manejo de errores (opcional)
```

### Archivos Clave

**server.js**
```javascript
// Configuración Express
// Conexión MongoDB
// Middleware global
// Rutas
// Error handling
```

**models/User.js**
```javascript
// Schema: name, email, password, phone, role
// Methods: matchPassword()
// Pre-save: hash password con bcrypt
```

**models/Doctor.js**
```javascript
// Schema: name, speciality, phone, email, licenseNumber
// Validaciones de especialidad
```

**models/Appointment.js**
```javascript
// Schema: clientId, doctorId, date, time, reason, status
// Validaciones de status
// Relaciones con User y Doctor
```

**middleware/auth.js**
```javascript
// protect: Valida JWT
// authorize: Valida roles (admin/cliente)
```

---

## 👨‍💼 Admin Panel (`admin/`)

```
admin/
├── package.json               # Dependencias React
├── public/
│   └── index.html            # HTML principal
├── src/
│   ├── index.js              # Entrada React
│   ├── App.js                # Componente raíz
│   ├── Admin.js              # Layout principal
│   │
│   ├── components/           # Componentes React
│   │   ├── AdminDashboard.js # Panel principal admin
│   │   ├── Login.js          # Formulario login admin
│   │   ├── AppointmentList.js
│   │   ├── DoctorForm.js
│   │   └── StatsCard.js
│   │
│   ├── services/             # Llamadas a API
│   │   ├── api.js           # Configuración Axios
│   │   └── services.js      # Funciones de servicio
│   │
│   └── styles/              # CSS
│       └── Admin.css        # Estilos globales
│
├── .env.example
└── .gitignore
```

### Componentes Principales

**Login.js**
- Formulario con email/password
- Validación de rol (solo admin)
- Almacena JWT en localStorage

**AdminDashboard.js**
- Tarjetas de estadísticas
- Tabla de citas con filtros
- Botones de acción (confirmar, completar, cancelar)
- Formulario para agregar doctores
- Grid de doctores

---

## � Frontend (`frontend/`)

```
client/
├── package.json               # Dependencias React
├── public/
│   └── index.html            # HTML principal
├── src/
│   ├── index.js              # Entrada React
│   ├── App.js                # Componente raíz
│   ├── ClientApp.js          # Layout cliente
│   │
│   ├── components/           # Componentes React
│   │   ├── ClientDashboard.js # Panel cliente
│   │   ├── Login.js          # Formulario login
│   │   ├── Register.js       # Formulario registro
│   │   ├── AppointmentForm.js
│   │   ├── AppointmentList.js
│   │   └── DoctorGrid.js
│   │
│   ├── services/             # Llamadas a API
│   │   ├── api.js           # Configuración Axios
│   │   └── services.js      # Funciones de servicio
│   │
│   └── styles/              # CSS
│       └── ClientApp.css    # Estilos globales
│
├── .env.example
└── .gitignore
```

### Componentes Principales

**Register.js**
- Formulario: nombre, email, teléfono, contraseña
- Auto-asigna role: "cliente"

**Login.js**
- Formulario: email, contraseña
- Redirige a dashboard si es cliente

**ClientDashboard.js**
- Tarjeta de bienvenida
- Formulario para agendar cita
- Lista de mis citas
- Grid de doctores disponibles

---

## 🔗 Servicios Compartidos

### `api.js` (Backend)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Interceptor: Agrega JWT al header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### `services.js` (Funciones)

```javascript
// authService
- register(userData)
- login(email, password)
- getMe()

// appointmentService
- createAppointment(data)
- getAppointments()
- updateAppointment(id, data)
- cancelAppointment(id)

// doctorService
- getDoctors()
- createDoctor(data)
- updateDoctor(id, data)
```

---

## 🔐 Flujos de Datos

### 1️⃣ Autenticación

```
Usuario → Login.js → api.post('/auth/login')
    ↓
Backend: authController.login()
    ↓
Verifica email/password
    ↓
Genera JWT
    ↓
localStorage.setItem('token', jwt)
    ↓
Redirige a dashboard
```

### 2️⃣ Agendar Cita

```
Usuario → ClientDashboard → form
    ↓
api.post('/appointments', data, { headers: { Authorization: Bearer token } })
    ↓
Backend: appointmentController.createAppointment()
    ↓
Middleware: valida JWT
    ↓
Controller: valida datos
    ↓
Model: crea en MongoDB
    ↓
Devuelve confirmación
    ↓
Frontend: actualiza lista
```

### 3️⃣ Gestionar Cita (Admin)

```
Admin → AdminDashboard → ver citas
    ↓
Click "Confirmar" → api.put('/appointments/:id', {status: 'confirmada'})
    ↓
Backend: validar token + role admin
    ↓
Actualizar en MongoDB
    ↓
Frontend: actualiza status
```

---

## 📊 Relaciones de Base de Datos

```
User
├── id (ObjectId)
├── name (String)
├── email (String) - UNIQUE
├── password (String) - HASHED
├── phone (String)
├── role (enum: "cliente", "admin")
└── timestamps

Doctor
├── id (ObjectId)
├── name (String)
├── speciality (enum: 7 opciones)
├── phone (String)
├── email (String) - UNIQUE
├── licenseNumber (String) - UNIQUE
├── active (Boolean)
└── timestamps

Appointment
├── id (ObjectId)
├── clientId (ref: User)
├── doctorId (ref: Doctor)
├── date (Date)
├── time (String)
├── reason (String)
├── status (enum: 4 opciones)
├── notes (String)
└── timestamps
```

---

## 🚀 Cómo Ejecutar

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
# Escucha en http://localhost:5000
```

### Terminal 2 - Admin Panel
```bash
cd admin
npm install
npm start
# Escucha en http://localhost:3000
```

### Terminal 3 - Frontend
```bash
cd frontend
npm install
npm start
# Escucha en http://localhost:3001
```

---

## 📝 Variables de Entorno

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/medical-appointments
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Admin (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Admin Medical
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Medical Appointments
```

---

## 🔒 Seguridad

| Nivel | Tecnología | Detalle |
|-------|-----------|--------|
| Frontend | HTTPS | SSL/TLS (producción) |
| Transporte | JWT | Token en Authorization header |
| Backend | Middleware | Validación JWT + roles |
| Base Datos | Bcrypt | Contraseñas hasheadas (salt: 10) |
| Validación | Mongoose | Schema validation |

---

## 🎯 Próximos Pasos

1. ✅ Backend completado
2. ✅ Admin panel completado
3. ✅ Client portal completado
4. ⏳ Desplegar a producción
5. ⏳ Añadir notificaciones email
6. ⏳ Sistema de recordatorios

---

Para más información, consulta:
- [README.md](README.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [QUICK_START.md](QUICK_START.md)
