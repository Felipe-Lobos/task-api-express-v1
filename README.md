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

## ⚠️ Nota sobre ramas y base de datos

- **Rama actual (sqlite)**: Esta rama mantiene la implementación con **SQLite** (archivo `database.db` y la dependencia **better-sqlite3**). Es ideal para desarrollo local y pruebas rápidas.
- **Rama `main` (migración a PostgreSQL)**: La rama `main` será migrada a **PostgreSQL**; allí se actualizarán la configuración, dependencias y scripts de despliegue (por ejemplo, añadir `pg` o un cliente ORM).

## 🧪 Pruebas con REST Client (VS Code)

Sigue estos pasos para ejecutar las pruebas incluidas en la raíz del repositorio:

1. Instala la extensión **REST Client** (por Huachao Mao) en VS Code.
2. Abre `test-localhost.http` para pruebas locales o `test-production-render.http` para probar el despliegue en producción.
3. Para pruebas locales, asegúrate de tener el archivo `.env` con `PORT` configurado, o edita la variable `@baseUrl` al inicio del archivo si prefieres usar otro puerto.
4. Haz clic en "Send Request" arriba de cada petición en el archivo `.http` o usa la paleta de comandos.
5. Los archivos `.http` contienen ejemplos de GET, POST, PUT y DELETE para los endpoints principales.

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