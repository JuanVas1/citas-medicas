# 🏗️ Arquitectura del Sistema - Citas Médicas

## Diagrama General de la Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADORES WEB                          │
└────────────────┬──────────────────────────────┬─────────────────┘
                 │                              │
        ┌────────▼─────────┐          ┌────────▼─────────┐
        │                  │          │                  │
        │  ADMIN PANEL     │          │  CLIENT PORTAL   │
        │   (React)        │          │    (React)       │
        │ :3000            │          │    :3001         │
        │                  │          │                  │
        │  - Dashboard     │          │  - Login         │
        │  - Gestión       │          │  - Registro      │
        │  - Citas         │          │  - Agendar       │
        │  - Doctores      │          │  - Mis Citas     │
        │                  │          │                  │
        └────────┬─────────┘          └────────┬─────────┘
                 │                              │
                 │         HTTP/REST            │
                 │     (Axios + JWT)            │
                 │                              │
                 └──────────────┬───────────────┘
                                │
                    ┌───────────▼────────────┐
                    │                        │
                    │   BACKEND API          │
                    │  (Node.js + Express)   │
                    │      :5000             │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │  Rutas API REST  │  │
                    │  │  - /auth         │  │
                    │  │  - /appointments │  │
                    │  │  - /doctors      │  │
                    │  └──────────────────┘  │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │  Controllers     │  │
                    │  │  - Auth          │  │
                    │  │  - Appointment   │  │
                    │  │  - Doctor        │  │
                    │  └──────────────────┘  │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │  Middleware      │  │
                    │  │  - JWT Auth      │  │
                    │  │  - Validación    │  │
                    │  └──────────────────┘  │
                    │                        │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │                        │
                    │   MONGODB DATABASE     │
                    │    (Local/Atlas)       │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │  Collections:    │  │
                    │  │  - users         │  │
                    │  │  - doctors       │  │
                    │  │  - appointments  │  │
                    │  └──────────────────┘  │
                    │                        │
                    └────────────────────────┘
```

---

## Flujo de Datos

### 1️⃣ **Flujo de Autenticación**

```
┌──────────────────┐
│   Usuario/Admin  │
└────────┬─────────┘
         │
         │ Ingresa credenciales
         ▼
┌──────────────────────────┐
│   Frontend (Login)       │
│ - Validación básica      │
│ - Envía POST /auth/login │
└────────┬─────────────────┘
         │
         │ HTTP POST
         ▼
┌──────────────────────────────┐
│   Backend API                │
│ POST /api/auth/login         │
│ ├─ Recibe email + password   │
│ └─ Busca usuario en DB       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   MongoDB                    │
│ db.users.findOne({email})    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   Validación                 │
│ - Verifica contraseña        │
│ - Genera JWT Token           │
└────────┬─────────────────────┘
         │
         │ Devuelve {token, user}
         ▼
┌──────────────────────────────┐
│   Frontend                   │
│ - Almacena token en localStorage
│ - Redirige al dashboard      │
└──────────────────────────────┘
```

### 2️⃣ **Flujo de Agendar Cita (Cliente)**

```
┌──────────────────┐
│   Cliente        │
└────────┬─────────┘
         │
         │ Completa formulario
         │ (doctor, fecha, hora, motivo)
         ▼
┌─────────────────────────────────┐
│   Frontend (ClientDashboard)     │
│ POST /api/appointments          │
│ Headers: {Authorization: token} │
└────────┬────────────────────────┘
         │
         │ HTTP POST + JWT
         ▼
┌─────────────────────────────────┐
│   Middleware (auth.js)          │
│ - Valida JWT Token              │
│ - Extrae userId del token       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Controller (appointmentCtrl)   │
│ - Valida datos                  │
│ - Crea documento                │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Mongoose Model                │
│ Appointment.create()            │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   MongoDB                       │
│ db.appointments.insertOne()     │
└────────┬────────────────────────┘
         │
         │ Devuelve cita creada
         ▼
┌─────────────────────────────────┐
│   Frontend                      │
│ - Muestra confirmación          │
│ - Actualiza lista de citas      │
└─────────────────────────────────┘
```

### 3️⃣ **Flujo de Gestión de Cita (Admin)**

```
┌──────────────────┐
│    Admin         │
└────────┬─────────┘
         │
         │ Haz clic en "Confirmar/Completar"
         ▼
┌────────────────────────────────┐
│   Frontend (AdminDashboard)     │
│ PUT /api/appointments/:id      │
│ body: {status: "confirmada"}   │
└────────┬───────────────────────┘
         │
         │ HTTP PUT + JWT
         ▼
┌────────────────────────────────┐
│   Middleware (auth.js)         │
│ - Valida JWT                   │
│ - Verifica role === "admin"    │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│   Controller (appointmentCtrl)  │
│ - Valida ID de cita            │
│ - Actualiza estado             │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│   MongoDB                      │
│ db.appointments.updateOne()    │
└────────┬───────────────────────┘
         │
         │ Devuelve cita actualizada
         ▼
┌────────────────────────────────┐
│   Frontend                     │
│ - Actualiza estado en la UI    │
│ - Refresca lista de citas      │
└────────────────────────────────┘
```

---

## Arquitectura por Capas

```
┌──────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│              (React Components - Admin & Client)                 │
├──────────────────────────────────────────────────────────────────┤
│  - Login / Register                                              │
│  - AdminDashboard / ClientDashboard                              │
│  - Forms (New Appointment, Add Doctor)                           │
│  - Lists (Citas, Doctores)                                       │
└──────────────────────────────────────────────────────────────────┘
                              ▲ ▼
                    API Calls via Axios
                              │
┌──────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                              │
│                   (API REST Endpoints)                           │
├──────────────────────────────────────────────────────────────────┤
│  Routes:                                                          │
│  - /api/auth (POST register, login)                              │
│  - /api/appointments (GET, POST, PUT, PATCH)                     │
│  - /api/doctors (GET, POST, PUT, DELETE)                         │
└──────────────────────────────────────────────────────────────────┘
                              ▲ ▼
                  Controllers & Business Logic
                              │
┌──────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│               (Controllers & Service Functions)                  │
├──────────────────────────────────────────────────────────────────┤
│  - authController (registro, login, autenticación)               │
│  - appointmentController (CRUD citas)                            │
│  - doctorController (CRUD doctores)                              │
│  - Validaciones                                                   │
│  - JWT Token Generation                                          │
└──────────────────────────────────────────────────────────────────┘
                              ▲ ▼
                  Mongoose ORM & Middleware
                              │
┌──────────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                            │
│         (Mongoose Models - Schema Definition)                    │
├──────────────────────────────────────────────────────────────────┤
│  - User Model (Schema + Methods)                                 │
│  - Doctor Model (Schema)                                         │
│  - Appointment Model (Schema + References)                       │
│  - Validaciones de datos                                         │
│  - Pre/Post Hooks (ej: encriptar password)                       │
└──────────────────────────────────────────────────────────────────┘
                              ▲ ▼
                        MongoDB Driver
                              │
┌──────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                                 │
│                    (MongoDB)                                     │
├──────────────────────────────────────────────────────────────────┤
│  Collections:                                                     │
│  - users (Clientes + Admins)                                     │
│  - doctors (Información de doctores)                             │
│  - appointments (Citas médicas)                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Componentes y Sus Responsabilidades

### 🎨 **Frontend (React)**

#### Admin Panel
```
AdminDashboard
├── Estadísticas (Cards)
├── Sección de Citas
│   ├── Filtros
│   ├── Lista de citas
│   └── Botones de acción
└── Sección de Doctores
    ├── Formulario (agregar)
    └── Grid de doctores
```

#### Client Portal
```
ClientDashboard
├── Welcome Card
├── Nueva Cita Form
├── Mis Citas
│   ├── Tarjetas de cita
│   └── Botón cancelar
└── Doctores Disponibles
    └── Cards con info
```

### 🖥️ **Backend (Node.js)**

#### Routes
```
/api/auth
  ├── POST /register
  └── POST /login
  └── GET /me

/api/appointments
  ├── GET / (lista)
  ├── POST / (crear)
  ├── PUT /:id (actualizar)
  └── PATCH /:id/cancel

/api/doctors
  ├── GET / (lista)
  ├── GET /:id (uno)
  ├── POST / (crear)
  ├── PUT /:id (actualizar)
  └── DELETE /:id
```

#### Controllers
```
authController
├── register()
├── login()
└── getMe()

appointmentController
├── createAppointment()
├── getAppointments()
├── updateAppointment()
└── cancelAppointment()

doctorController
├── getDoctors()
├── getDoctorById()
├── createDoctor()
├── updateDoctor()
└── deleteDoctor()
```

#### Models
```
User
├── name
├── email (unique)
├── password (hashed)
├── phone
├── role (cliente/admin)
└── timestamps

Doctor
├── name
├── speciality
├── phone
├── email
├── licenseNumber
├── active
└── timestamps

Appointment
├── clientId (ref: User)
├── doctorId (ref: Doctor)
├── date
├── time
├── reason
├── status (pendiente/confirmada/completada/cancelada)
├── notes
└── timestamps
```

---

## Flujo de Seguridad

```
┌─────────────────────────────────────────────────────────┐
│            CLIENTE HACE SOLICITUD                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ Frontend: Axios Interceptor │
        │ - Obtiene token del storage │
        │ - Agrega a headers         │
        └────────────────┬───────────┘
                         │
                         ▼
         ┌──────────────────────────────┐
         │ HTTP Request con JWT Token   │
         │ Authorization: Bearer <token>│
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   Backend Middleware (auth)  │
         │ - Extrae token del header    │
         │ - Verifica firma JWT         │
         │ - Obtiene userData del token │
         └──────────────┬───────────────┘
                        │
                   ¿Token válido?
                    /         \
                  SI/           \NO
                  /               \
                 ▼                 ▼
         ┌──────────┐      ┌──────────────┐
         │Continúa  │      │Error 401:    │
         │Acceso    │      │No autorizado │
         └────┬─────┘      └──────────────┘
              │
              ▼
    ┌──────────────────────┐
    │ Verifica Permisos    │
    │ (role: admin?)       │
    └────────┬─────────────┘
             │
        ¿Tiene permisos?
         /         \
       SI/           \NO
       /               \
      ▼                 ▼
 ┌────────┐      ┌────────────────┐
 │Procesa │      │Error 403:      │
 │Request │      │No tiene acceso │
 └────┬───┘      └────────────────┘
      │
      ▼
 ┌──────────────────────┐
 │ Ejecuta Controller   │
 └────────┬─────────────┘
          │
          ▼
 ┌──────────────────────┐
 │ Accede a BD          │
 │ (Mongoose Query)     │
 └────────┬─────────────┘
          │
          ▼
 ┌──────────────────────┐
 │ Devuelve Respuesta   │
 └────────┬─────────────┘
          │
          ▼
 ┌──────────────────────┐
 │ Frontend: Muestra    │
 │ resultados           │
 └──────────────────────┘
```

---

## Modelo de Datos (ER)

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ _id (PK)        │
│ name            │
│ email (unique)  │
│ password        │
│ phone           │
│ role            │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N (Cliente -> Citas)
         │
         ▼
┌──────────────────────┐          ┌─────────────────┐
│   Appointments       │──────────▶│    Doctors      │
├──────────────────────┤  N:1      ├─────────────────┤
│ _id (PK)             │           │ _id (PK)        │
│ clientId (FK)        │           │ name            │
│ doctorId (FK)        │           │ speciality      │
│ date                 │           │ phone           │
│ time                 │           │ email           │
│ reason               │           │ licenseNumber   │
│ status               │           │ active          │
│ notes                │           │ createdAt       │
│ createdAt            │           │ updatedAt       │
│ updatedAt            │           └─────────────────┘
└──────────────────────┘
```

---

## Tecnologías y Sus Roles

| Tecnología | Rol | Responsabilidad |
|-----------|-----|-----------------|
| **React** | Frontend | Interfaz de usuario, componentes |
| **Express** | Backend | Rutas, manejo de requests |
| **MongoDB** | BD | Persistencia de datos |
| **Mongoose** | ORM | Esquemas y validaciones |
| **JWT** | Autenticación | Seguridad y sesiones |
| **Bcrypt** | Encriptación | Seguridad de contraseñas |
| **Axios** | HTTP Client | Comunicación Frontend-Backend |
| **CORS** | Seguridad | Permite requests cross-origin |

---

## Ciclo de Vida de una Solicitud

```
1. Usuario interactúa con UI (React)
   ▼
2. Frontend valida datos localmente
   ▼
3. Axios interceptor agrega JWT token
   ▼
4. HTTP request enviado al servidor
   ▼
5. Express recibe request en router
   ▼
6. Middleware de autenticación valida JWT
   ▼
7. Controller procesa la lógica
   ▼
8. Mongoose query a MongoDB
   ▼
9. MongoDB retorna datos
   ▼
10. Controller formatea respuesta
    ▼
11. Express envía JSON al cliente
    ▼
12. Axios en Frontend procesa respuesta
    ▼
13. React actualiza estado y re-renderiza
    ▼
14. Usuario ve cambios en UI
```

---

## Escalabilidad Futura

```
Actual:
┌─────────────┐     ┌──────────┐     ┌────────┐
│ Admin React │────▶│ Express  │────▶│MongoDB │
└─────────────┘     │ Server   │     └────────┘
┌─────────────┐     └──────────┘
│Client React │────▶ :5000
└─────────────┘

Futuro (posible):
┌─────────────┐     ┌──────────┐
│ Admin React │────▶│ Express  │     ┌────────┐
└─────────────┘     │ API      │────▶│MongoDB │
┌─────────────┐     │ Gateway  │     └────────┘
│Client React │────▶└──────────┘     ┌───────────┐
└─────────────┘          ▲            │Cache      │
┌─────────────┐          │            │(Redis)    │
│Mobile App   │──────────┘            └───────────┘
└─────────────┘

                    Microservicios:
                    - Auth Service
                    - Appointment Service
                    - Doctor Service
```

---

**Última actualización:** 2026-06-08
