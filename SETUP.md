# Guía de Configuración del Proyecto

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn
- 3 terminales

## Pasos para Ejecutar

### Terminal 1: Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend en `http://localhost:5000`

### Terminal 2: Panel Admin

```bash
cd admin
npm install
npm start
```

Admin en `http://localhost:3000`

**Login:**
- Email: admin@example.com
- Password: admin123

### Terminal 3: Portal de Clientes

```bash
cd client
npm install
npm start
```

Cliente en `http://localhost:3001`

**Acceso de Prueba:**
- Email: cliente@example.com
- Password: cliente123

## Base de Datos

MongoDB se creará automáticamente al conectarse. Asegúrate que está ejecutándose:

```bash
mongod
```

O usa MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/citas_medicas
```

## Funcionalidades

### 👤 Clientes
- Registrarse/Iniciar Sesión
- Ver doctores disponibles
- Agendar citas
- Ver historial de citas
- Cancelar citas

### 👨‍⚕️ Administradores
- Gestionar citas (confirmar, completar, cancelar)
- Gestionar doctores
- Ver información de pacientes
- Estadísticas

## Tecnologías

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Admin**: React, Axios, CSS3
- **Client**: React, Axios, CSS3
- **Autenticación**: JWT
- **Base de Datos**: MongoDB

¡Tu sistema de citas médicas está listo para usar!
