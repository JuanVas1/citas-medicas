# 📚 Guía de Documentación Completa

Bienvenido al Sistema de Citas Médicas. Esta guía te ayudará a encontrar la documentación correcta según tus necesidades.

---

## 🎯 ¿Qué necesitas hacer?

### 🚀 Quiero iniciar rápidamente

**Tiempo:** 5 minutos

Lee estos documentos en orden:
1. [README.md](README.md) - Visión general del proyecto
2. [QUICK_START.md](QUICK_START.md) - 3 comandos para empezar

**Resultado:** Tendrás el sistema funcionando localmente

---

### 🏛️ Quiero entender la arquitectura

**Tiempo:** 15-30 minutos

**Si tienes 10 minutos:**
- Lee [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md)
- Visualiza los diagramas ASCII
- Entiende el flujo básico

**Si tienes 30 minutos:**
- Lee [ARCHITECTURE.md](ARCHITECTURE.md)
- Estudia los diagramas Mermaid
- Comprende las capas y componentes
- Revisa la seguridad y escalabilidad

---

### 📁 Quiero conocer la estructura de carpetas

**Tiempo:** 10 minutos

Lee [STRUCTURE.md](STRUCTURE.md) que incluye:
- ✅ Estructura de todas las carpetas
- ✅ Descripción de archivos importantes
- ✅ Componentes principales
- ✅ Flujos de datos
- ✅ Base de datos

---

### 🔧 Quiero configurar la base de datos

**Tiempo:** 20 minutos

Lee estos documentos:
1. [SETUP.md](SETUP.md) - Configuración completa
   - Opciones: MongoDB local o Atlas
   - Variables de entorno
   - Datos de prueba
2. [QUICK_START.md](QUICK_START.md) - Sección de MongoDB

**Resultado:** Base de datos lista para usar

---

### 👨‍💻 Quiero desarrollar / hacer cambios

**Lectura recomendada:**

1. **Antes de empezar:**
   - [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) - Entiende cómo funciona
   - [STRUCTURE.md](STRUCTURE.md) - Localiza los archivos

2. **Según qué cambies:**
   - **Backend (Express/MongoDB):** Ve a `backend/` y revisa modelos, controladores, rutas
   - **Admin Panel (React):** Ve a `admin/src/` y revisa componentes
   - **Client Portal (React):** Ve a `client/src/` y revisa componentes

3. **Referencia rápida:**
   - [INDEX.md](INDEX.md) - Tabla de endpoints
   - [README.md](README.md) - Credenciales y tecnologías

---

### 🐛 Tengo un problema / error

**Pasos de diagnóstico:**

1. Consulta [QUICK_START.md](QUICK_START.md) - Sección "Troubleshooting"
2. Verifica que los 3 servidores estén corriendo:
   - Backend: http://localhost:5000
   - Admin: http://localhost:3000
   - Client: http://localhost:3001
3. Revisa la consola del navegador (F12)
4. Revisa la terminal del backend

**Problemas comunes:**

- **"Cannot GET /api/..."** → Backend no está corriendo
- **"CORS error"** → Backend CORS no está configurado
- **"JWT token invalid"** → Token expirado o inválido
- **"MongoDB connection error"** → Base de datos no accesible

---

### 📊 Quiero ver los credenciales de prueba

Ve a [README.md](README.md) o [INDEX.md](INDEX.md) - Sección "Credenciales"

**Por defecto:**
- Email Admin: `admin@medical.com` / Contraseña: `admin123`
- Email Cliente: `cliente@medical.com` / Contraseña: `cliente123`

---

### 🚀 Quiero desplegar a producción

**Documentos necesarios:**
1. [SETUP.md](SETUP.md) - Sección "Configuración MongoDB Atlas"
2. [README.md](README.md) - Tecnologías y requisitos
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Sección "Escalabilidad"

**Pasos generales:**
1. Usar MongoDB Atlas en lugar de local
2. Configurar variables de entorno (.env)
3. Desplegar Backend en servidor (Heroku, DigitalOcean, etc.)
4. Desplegar Admin y Client en hosting (Vercel, Netlify, etc.)

---

## 📖 Índice Completo de Documentación

### Documentos Principales

| Documento | Enfoque | Público | Tiempo |
|-----------|---------|---------|--------|
| [README.md](README.md) | Visión general, features | Todos | 5 min |
| [QUICK_START.md](QUICK_START.md) | Puesta en marcha | Developers | 5 min |
| [SETUP.md](SETUP.md) | Configuración detallada | DevOps/Developers | 20 min |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura profunda | Architects/Leads | 30 min |
| [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) | Arquitectura básica | Todos | 10 min |
| [STRUCTURE.md](STRUCTURE.md) | Estructura de código | Developers | 15 min |
| [INDEX.md](INDEX.md) | Referencia rápida | Todos | 3 min |
| Esta guía | Navegación | Todos | 5 min |

---

## 🗂️ Estructura de Carpetas

```
proyecto arqui/
├── 📋 Documentación (7 archivos)
│   ├── README.md
│   ├── QUICK_START.md
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── ARCHITECTURE_SIMPLE.md
│   ├── STRUCTURE.md
│   └── INDEX.md
│
├── 🖥️ backend/          → Servidor Node.js
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── package.json
│
├── 👨‍💼 admin/            → Panel Administrador (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── 👤 client/           → Portal Cliente (React)
    ├── src/
    ├── public/
    └── package.json
```

---

## 💡 Tips Útiles

### Para Principiantes
1. Empieza con [QUICK_START.md](QUICK_START.md)
2. Luego lee [README.md](README.md)
3. Prueba hacer login con las credenciales
4. Explora la interfaz

### Para Developers
1. Revisa [STRUCTURE.md](STRUCTURE.md)
2. Localiza el archivo que quieres modificar
3. Consulta [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) para entender el flujo
4. Haz cambios y recarga el navegador

### Para Architects
1. Lee [ARCHITECTURE.md](ARCHITECTURE.md) completo
2. Revisa los diagramas Mermaid
3. Estudia la sección de escalabilidad
4. Considera opciones de mejora

---

## 🔗 Enlaces Rápidos

### Setup
- [Instalar dependencias](QUICK_START.md#instalación)
- [Configurar MongoDB](SETUP.md#mongodb)
- [Variables de entorno](SETUP.md#variables-de-entorno)

### Desarrollo
- [Estructura del código](STRUCTURE.md)
- [Rutas API](INDEX.md#endpoints-de-la-api)
- [Componentes React](STRUCTURE.md#-admin-panel-admin)

### Referencia
- [Credenciales](README.md#credenciales)
- [Tecnologías](README.md#tecnologías-usadas)
- [Endpoints](INDEX.md#endpoints-de-la-api)

---

## ❓ Preguntas Frecuentes

**P: ¿Por dónde empiezo?**
A: Lee [QUICK_START.md](QUICK_START.md) - 5 minutos y tendrás todo corriendo.

**P: ¿Cómo está organizado el código?**
A: Lee [STRUCTURE.md](STRUCTURE.md) - Explicación completa de carpetas y archivos.

**P: ¿Cómo funciona el sistema?**
A: Lee [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md) - Diagramas visuales de cómo se conectan las partes.

**P: ¿Dónde está la API?**
A: En `backend/` - Lee [README.md](README.md) para endpoints o [INDEX.md](INDEX.md) para la tabla.

**P: ¿Cómo cambio algo en el admin?**
A: Ve a `admin/src/` - Modifica componentes React y recarga (http://localhost:3000).

**P: ¿Cómo cambio la base de datos?**
A: Lee [SETUP.md](SETUP.md) - Sección de MongoDB.

**P: ¿Tengo un error, qué hago?**
A: Lee [QUICK_START.md](QUICK_START.md) - Sección "Troubleshooting".

---

## 📞 Contacto y Soporte

Para problemas o mejoras, consulta:
1. Documentación relacionada (usa los enlaces arriba)
2. Código fuente en las carpetas
3. Comentarios en el código

---

## ✅ Checklist de Lectura

- [ ] Leí [README.md](README.md)
- [ ] Leí [QUICK_START.md](QUICK_START.md)
- [ ] Ejecuté el sistema localmente
- [ ] Leí [ARCHITECTURE_SIMPLE.md](ARCHITECTURE_SIMPLE.md)
- [ ] Exploré la estructura en [STRUCTURE.md](STRUCTURE.md)
- [ ] Hice login como admin y cliente
- [ ] Probé algunas funcionalidades

---

**Documento generado:** Enero 2025
**Versión:** 1.0
**Estado:** Completo

Próximas actualizaciones: Cuando se agreguen nuevas features o se mude a producción.
