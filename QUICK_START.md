# 🚀 Inicio Rápido del Proyecto

## Requisitos
- Node.js v14+
- MongoDB (local o remoto)
- 3 terminales

---

## 1️⃣ Configurar Backend

**Terminal 1:**
```bash
cd backend
npm install
```

Crear archivo `.env`:
```
MONGODB_URI=mongodb://localhost:27017/citas_medicas
JWT_SECRET=tu_clave_secreta_super_segura_aqui_2024
NODE_ENV=development
PORT=5000
```

Ejecutar:
```bash
npm run dev
```

✅ Backend corriendo en `http://localhost:5000`

---

## 2️⃣ Panel de Administración

**Terminal 2:**
```bash
cd admin
npm install
npm start
```

✅ Admin en `http://localhost:3000`

**Login:** 
- Email: `admin@example.com`
- Password: `admin123`

---

## 3️⃣ Frontend

**Terminal 3:**
```bash
cd frontend
npm install
npm start
```

✅ Frontend en `http://localhost:3001`

**Login Prueba:**
- Email: `usuario@example.com`
- Password: `usuario123`

O crear nueva cuenta en el formulario de registro.

---

## 🎯 Funcionalidades por Panel

### Frontend
1. Registrarse / Iniciar sesión
2. Ver doctores disponibles
3. Agendar cita (seleccionar doctor, fecha, hora, motivo)
4. Ver mis citas
5. Cancelar cita

### Admin
1. Login (solo admin)
2. Ver todas las citas (filtrar por estado)
3. Confirmar/Completar/Cancelar citas
4. Agregar nuevos doctores
5. Ver información de pacientes
6. Estadísticas

---

## 🗄️ MongoDB

Si usas MongoDB local:
```bash
mongod
```

O usa MongoDB Atlas (nube):
```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/citas_medicas
```

---

## 📚 Endpoints API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Citas
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `PATCH /api/appointments/:id/cancel`

### Doctores
- `GET /api/doctors`
- `POST /api/doctors` (admin)
- `PUT /api/doctors/:id` (admin)
- `DELETE /api/doctors/:id` (admin)

---

## 🆘 Troubleshooting

**Error: ECONNREFUSED en MongoDB**
- Asegurate que MongoDB está corriendo: `mongod`

**Error: Puerto en uso (3000 o 5000)**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Error: npm ERR! missing script: "start"**
- Asegúrate de estar en la carpeta correcta (`admin` o `client`)

---

## 📝 Crear Admin Desde MongoDB

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "HASH_AQUI", // bcrypt hash
  phone: "+58412345678",
  role: "admin"
})
```

O simplemente registrarse como cliente y cambiar el rol a "admin" en MongoDB.

---

## 🎨 Personalización

- Colores: Editar `admin/src/styles/App.css` y `client/src/styles/App.css`
- Especialidades: Modificar `backend/models/Doctor.js`
- APIs: Ver `admin/src/services.js` y `client/src/services.js`

---

¡Listo! 🎉 Sistema de citas médicas completamente funcional.
