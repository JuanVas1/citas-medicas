# Sistema de Citas Médicas

Sistema completo para gestión de citas médicas con interfaces separadas para clientes y administradores.

> 📚 **¿Por dónde empiezo?** Lee [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md) para navegar según tus necesidades.

## 🏛️ Arquitectura

```
┌─────────────────────────────────┐
│   Admin Panel & Client Portal   │
│        (React - 3 Apps)         │
└───────────────┬─────────────────┘
                │ HTTP/REST + JWT
                ▼
        ┌──────────────────┐
        │  Backend API     │
        │  (Node + Express)│
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │    MongoDB       │
        │   (Database)     │
        └──────────────────┘
```

**📋 Reglas de Negocio:**
→ [REGLAS_NEGOCIO.md](REGLAS_NEGOCIO.md) - Requisitos y validaciones

Documentación de arquitectura:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Detallada
- [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) - Resumida

---

## Tecnologías Usadas

### Backend
- **Node.js** con Express.js
- **MongoDB** para base de datos
- **JWT** para autenticación
- **Bcrypt** para encriptación de contraseñas

### Frontend
- **React** 18
- **Axios** para solicitudes HTTP
- **CSS3** para estilos responsivos

## Estructura del Proyecto

```
proyecto-arqui/
├── backend/
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas API
│   ├── controllers/     # Controladores
│   ├── middleware/      # Middleware (autenticación)
│   ├── config/          # Configuración
│   ├── server.js        # Servidor principal
│   └── package.json
├── admin/
│   ├── public/          # Archivos estáticos
│   ├── src/
│   │   ├── components/  # Componentes React (AdminDashboard, Login)
│   │   ├── styles/      # Estilos CSS
│   │   ├── api.js       # Configuración Axios
│   │   ├── services.js  # Servicios API
│   │   ├── App.js       # Componente principal
│   │   └── index.js     # Punto de entrada
│   └── package.json
├── client/
│   ├── public/          # Archivos estáticos
│   ├── src/
│   │   ├── components/  # Componentes React (ClientDashboard, Login, Register)
│   │   ├── styles/      # Estilos CSS
│   │   ├── api.js       # Configuración Axios
│   │   ├── services.js  # Servicios API
│   │   ├── App.js       # Componente principal
│   │   └── index.js     # Punto de entrada
│   └── package.json
```

## Instalación

### Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Panel de Administración (Terminal 2)

```bash
cd admin
npm install
npm start
```

Panel Admin disponible en `http://localhost:3000`

### Portal de Clientes (Terminal 3)

```bash
cd client
npm install
npm start
```

Portal de Clientes disponible en `http://localhost:3001`

## Características

### 👤 Panel del Cliente (Portal de Pacientes)
- ✓ Registro e inicio de sesión
- ✓ Ver lista de doctores disponibles con especialidades
- ✓ Agendar nuevas citas con fecha y hora
- ✓ Ver historial de citas agendadas
- ✓ Cancelar citas pendientes
- ✓ Ver estado de cada cita (pendiente, confirmada, completada, cancelada)
- ✓ Interfaz amigable y responsiva

### 👨‍⚕️ Panel del Administrador
- ✓ Autenticación segura (solo para admins)
- ✓ Gestión completa de citas (ver todas las citas)
- ✓ Confirmar citas pendientes
- ✓ Marcar citas como completadas
- ✓ Cancelar citas
- ✓ Gestión de doctores (agregar, editar, eliminar)
- ✓ Ver información detallada de pacientes
- ✓ Notas y observaciones en citas
- ✓ Estadísticas de citas y doctores
- ✓ Interfaz profesional y fácil de usar

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Citas
- `GET /api/appointments` - Obtener todas las citas
- `POST /api/appointments` - Crear nueva cita
- `PUT /api/appointments/:id` - Actualizar cita
- `PATCH /api/appointments/:id/cancel` - Cancelar cita

### Doctores
- `GET /api/doctors` - Obtener todos los doctores
- `GET /api/doctors/:id` - Obtener doctor específico
- `POST /api/doctors` - Crear doctor (solo admin)
- `PUT /api/doctors/:id` - Actualizar doctor (solo admin)
- `DELETE /api/doctors/:id` - Eliminar doctor (solo admin)

## Datos de Prueba

### Credenciales Admin
- Email: `admin@example.com`
- Contraseña: `admin123`
- Rol: administrador

### Credenciales Cliente
- Email: `cliente@example.com`
- Contraseña: `cliente123`
- Rol: cliente

**Puedes crear más cuentas de clientes directamente desde el formulario de registro en el portal.**

## Configuración MongoDB

Asegúrate de tener MongoDB instalado y corriendo localmente o actualiza la URL de conexión en el `.env`:

```
MONGODB_URI=mongodb://localhost:27017/citas_medicas
```

## Variables de Entorno (.env)

```
MONGODB_URI=mongodb://localhost:27017/citas_medicas
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
NODE_ENV=development
PORT=5000
```

## Desarrollo

Para desarrollo con hot-reload en las 3 terminales:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Panel Admin:**
```bash
cd admin
npm start
```

**Terminal 3 - Portal Cliente:**
```bash
cd client
npm start
```

- Backend: `http://localhost:5000`
- Admin: `http://localhost:3000`
- Client: `http://localhost:3001`

## Próximas Mejoras

- [ ] Notificaciones por email
- [ ] Recordatorios de citas
- [ ] Sistema de calificación de doctores
- [ ] Historial de citas
- [ ] Exportación de reportes
- [ ] Integración con calendario
- [ ] Disponibilidad automática de horarios

## 📖 Documentación

**Punto de entrada:** [START_HERE.md](START_HERE.md) ⭐

**Guía completa de documentos:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

### Documentos principales:
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Índice de todos los documentos
- [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md) - Navegación personalizada
- [QUICK_START.md](QUICK_START.md) - Guía de inicio rápido (5 min)
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura detallada
- [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) - Arquitectura simplificada
- [STRUCTURE.md](STRUCTURE.md) - Estructura de código
- [SETUP.md](SETUP.md) - Configuración completa
- [ROADMAP.md](ROADMAP.md) - Futuro del proyecto
- [INDEX.md](INDEX.md) - Referencia rápida de APIs

## Licencia

ISC
