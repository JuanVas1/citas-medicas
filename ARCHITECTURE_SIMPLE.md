# 🏛️ ARQUITECTURA - Sistema de Citas Médicas

## Visualización Rápida

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIOS                             │
│          (Admin & Usuarios en Navegadores)             │
└──────┬─────────────────────────────┬────────────────────┘
       │                             │
       │  React :3000                │  React :3001
       │  (Admin Panel)              │  (Frontend)
       │                             │
┌──────▼──────────────────────────────▼──────────────────┐
│           FRONTEND APPLICATIONS                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Admin Panel          │          Frontend               │
│  ┌────────────────┐   │   ┌────────────────────────┐    │
│  │ Login          │   │   │ Login / Register       │    │
│  │ Dashboard      │   │   │ Agendar Cita          │    │
│  │ Gestión Citas  │   │   │ Ver Mis Citas         │    │
│  │ Gestión Docs   │   │   │ Ver Doctores          │    │
│  │ Estadísticas   │   │   │ Cancelar Cita         │    │
│  └────────────────┘   │   └────────────────────────┘    │
│                       │                                  │
│     Axios HTTP Client / JWT Authentication             │
│                                                          │
└──────────────┬────────────────────────────┬─────────────┘
               │                            │
               │     REST API :5000         │
               │                            │
┌──────────────▼────────────────────────────▼─────────────┐
│           BACKEND (Node.js + Express)                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Routes (/api/)                                         │
│  ├── /auth      → register, login, getMe               │
│  ├── /appointments → CRUD operations                   │
│  └── /doctors   → CRUD operations                      │
│                                                          │
│  Middleware                                             │
│  ├── JWT Authentication                                │
│  └── Role Authorization (admin/client)                 │
│                                                          │
│  Controllers                                            │
│  ├── authController                                    │
│  ├── appointmentController                             │
│  └── doctorController                                  │
│                                                          │
│  Models (Mongoose)                                      │
│  ├── User Schema                                       │
│  ├── Doctor Schema                                     │
│  └── Appointment Schema                                │
│                                                          │
└──────────────┬─────────────────────────────┬────────────┘
               │                             │
               │   MongoDB Driver/Query      │
               │                             │
┌──────────────▼─────────────────────────────▼────────────┐
│           DATABASE (MongoDB)                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Collections:                                           │
│  ├── users    → {id, name, email, password, role}     │
│  ├── doctors  → {id, name, specialty, email, phone}   │
│  └── appointments → {id, clientId, doctorId, date}    │
│                                                          │
│  Índices:                                               │
│  ├── users.email (unique)                              │
│  ├── appointments.clientId                             │
│  └── appointments.doctorId                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Flujos Principales

### 🔐 Flujo de Login

```
1. Usuario ingresa email + password
   ↓
2. Frontend valida formato
   ↓
3. POST /api/auth/login con credenciales
   ↓
4. Backend verifica en MongoDB
   ↓
5. Compara password con hash bcrypt
   ↓
6. Si correcto: genera JWT token
   ↓
7. Frontend almacena token en localStorage
   ↓
8. Redirige al dashboard
```

### 📅 Flujo de Agendar Cita

```
1. Cliente llena formulario (doctor, fecha, hora, motivo)
   ↓
2. Frontend valida datos
   ↓
3. POST /api/appointments con datos + token JWT
   ↓
4. Middleware valida JWT token
   ↓
5. Controller valida datos
   ↓
6. Mongoose crea documento en MongoDB
   ↓
7. Backend devuelve cita creada
   ↓
8. Frontend muestra confirmación y actualiza lista
```

### ✅ Flujo de Gestión de Cita (Admin)

```
1. Admin ve lista de citas en dashboard
   ↓
2. Admin hace click en "Confirmar" / "Completada" / "Cancelar"
   ↓
3. PUT /api/appointments/:id con nuevo status + token
   ↓
4. Middleware valida JWT y verifica role='admin'
   ↓
5. Controller actualiza cita en MongoDB
   ↓
6. Backend devuelve cita actualizada
   ↓
7. Frontend actualiza estado en UI
```

---

## Componentes Principales

### Frontend (React)

**Admin Panel:**
- `AdminDashboard.js` - Panel principal
- `Login.js` - Autenticación admin
- Componentes de UI y estilos

**Client Portal:**
- `ClientDashboard.js` - Dashboard cliente
- `Login.js` - Login cliente
- `Register.js` - Registro cliente
- Componentes de UI y estilos

### Backend (Express)

**Rutas:**
- `routes/auth.js` - Rutas de autenticación
- `routes/appointments.js` - Rutas de citas
- `routes/doctors.js` - Rutas de doctores

**Controladores:**
- `controllers/authController.js` - Lógica de auth
- `controllers/appointmentController.js` - Lógica de citas
- `controllers/doctorController.js` - Lógica de doctores

**Modelos:**
- `models/User.js` - Schema de usuarios
- `models/Doctor.js` - Schema de doctores
- `models/Appointment.js` - Schema de citas

**Middleware:**
- `middleware/auth.js` - JWT validation y role checking

---

## Flujo de Datos (Data Flow)

```
Usuario Input
     ↓
React Component State
     ↓
Axios HTTP Request + JWT
     ↓
Express Router
     ↓
Middleware (JWT Validation)
     ↓
Controller (Business Logic)
     ↓
Mongoose Model
     ↓
MongoDB Query
     ↓
MongoDB Response
     ↓
Mongoose Model
     ↓
Controller Response
     ↓
Express Send JSON
     ↓
Axios Response
     ↓
React Component State Update
     ↓
Re-render UI
     ↓
Usuario Ve Cambios
```

---

## Seguridad (Security Layers)

```
1. Frontend:
   - Validación de inputs
   - HTTPS (recomendado)
   - XSS prevention

2. HTTP:
   - CORS habilitado
   - JWT en headers

3. Backend:
   - JWT verification
   - Role-based authorization
   - Input validation
   - SQL injection prevention (MongoDB)

4. Database:
   - Contraseñas hasheadas con bcrypt
   - Indexes para performance
   - Validaciones en schema
```

---

## Escalabilidad

### Actual (Monolítico)
- 1 servidor Node.js
- 1 MongoDB
- 2 frontends React (admin + client)

### Futuro (Escalable)
```
Load Balancer
    ↓
├─ Node API Server 1
├─ Node API Server 2
└─ Node API Server 3
    ↓
Cache Layer (Redis)
    ↓
├─ MongoDB Primary
├─ MongoDB Replica 1
└─ MongoDB Replica 2
```

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18.2.0 |
| HTTP Client | Axios | 1.4.0 |
| Backend | Express | 4.18.2 |
| ORM | Mongoose | 7.0.0 |
| Database | MongoDB | 4.4+ |
| Auth | JWT | ✓ |
| Seguridad | Bcrypt | 2.4.3 |

---

Para más detalles, ver [ARCHITECTURE.md](ARCHITECTURE.md)
