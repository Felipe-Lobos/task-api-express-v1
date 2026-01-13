# Task API - Express + SQLite

API REST para gestión de tareas construida con Express.js y SQLite.

## 🚀 Tecnologías

- **Node.js** v18+
- **Express** - Framework web
- **better-sqlite3** - Base de datos SQLite
- **Zod** - Validación de datos
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-Origin Resource Sharing

## 📦 Instalación

```bash
# Clonar repositorio
git clone <tu-repo>

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor desarrollo
npm run dev
```

## 🔌 Endpoints

### Health Check
```
GET /health
```

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/tasks | Obtener todas las tareas |
| GET | /api/tasks/:id | Obtener tarea por ID |
| POST | /api/tasks | Crear nueva tarea |
| PUT | /api/tasks/:id | Actualizar tarea |
| DELETE | /api/tasks/:id | Eliminar tarea |

## 📋 Ejemplos de Uso

### Crear tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi tarea", "description": "Descripción"}'
```

### Actualizar tarea
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## 🗂️ Estructura del Proyecto

```
task-api/
├── src/
│   ├── config/        # Configuración BD
│   ├── controllers/   # Lógica de negocio
│   ├── middlewares/   # Validaciones y errores
│   ├── models/        # Acceso a datos
│   ├── routes/        # Definición de rutas
│   ├── app.js         # Configuración Express
│   └── server.js      # Punto de entrada
├── database.db        # Base de datos SQLite
└── .env              # Variables de entorno
```

## 📄 Licencia

MIT