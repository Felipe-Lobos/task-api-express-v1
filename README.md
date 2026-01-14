# Task API - Express

API REST para gestión de tareas construida con Express.js. Por defecto esta rama llamada `postgres` implementa el proyecto usando **PostgreSQL** en local y **sin Prisma**. La versión final del proyecto usará **Prisma** junto con PostgreSQL en un servicio administrado (por ejemplo, **Neon**).

## ℹ️ Nota sobre la rama `postgres`

- La rama `postgres` está pensada para probar PostgreSQL en un entorno local sin depender de Prisma.
- La configuración y los scripts pueden diferir de la rama principal (por ejemplo, variables de entorno para conexión a Postgres).
- En la versión final se migrará a **Prisma** y se usará un proveedor de Postgres administrado (p. ej., **Neon**).

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

# Copiar variables de entorno (si existe)
cp .env.example .env

# Iniciar servidor desarrollo
npm run dev
```

## ⚙️ Variables de entorno (.env)

Crea un archivo `.env` en la raíz del proyecto con, como mínimo, las siguientes variables:

```env
# Servidor
PORT=3000
NODE_ENV=development

# PostgreSQL (rama `postgres`, local)
# Formato: postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskdb
```

Notas:

- En la rama principal (SQLite) no es necesario `DATABASE_URL` ya que se usa `database.db` local.
- Si usas un servicio administrado (ej. **Neon**), utiliza la `DATABASE_URL` que te proporcione el servicio y, si es necesario, habilita SSL en `src/config/database.js` (ver comentario sobre `ssl` en ese archivo).
- No subas tu `.env` al repositorio; añade el archivo a `.gitignore`.

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