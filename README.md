# Task API - Express + PostgreSQL + Prisma

API REST para gestión de tareas construida con **Express.js**, **PostgreSQL** (Neon) y **Prisma 6** como ORM.

## 📋 Ramas disponibles

Este repositorio contiene tres ramas principales con diferentes configuraciones:

| Rama | Base de Datos | ORM | Descripción |
|------|---------------|-----|-------------|
| **main** / **develop** | PostgreSQL (Neon) | Prisma 6 | ✅ **Rama principal** - Versión producción con BD administrada |
| **postgres** | PostgreSQL (Local) | Ninguno | PostgreSQL en localhost sin Prisma - para desarrollo local |
| **sqlite** | SQLite (Local) | Ninguno | SQLite con better-sqlite3 - versión original |

## 🚀 Tecnologías (rama main/develop)

- **Node.js** v18+
- **Express** v5.2+ - Framework web
- **PostgreSQL** - Base de datos (alojada en Neon)
- **Prisma** v6 - ORM y migrations
- **Zod** - Validación de datos
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-Origin Resource Sharing

## 📦 Instalación y configuración

### 1. Clonar repositorio y instalar dependencias

```bash
# Clonar repositorio
git clone <tu-repo>
cd task-api-claude

# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# PostgreSQL - Neon
# Obtén la URL desde https://console.neon.tech
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/taskdb?sslmode=require
```

**Nota:** Si aún no tienes una base de datos en **Neon**, puedes:
1. Crear una cuenta gratuita en https://console.neon.tech
2. Crear un proyecto
3. Copiar la cadena de conexión (`DATABASE_URL`)

### 3. Ejecutar migraciones de Prisma

```bash
# Crear/actualizar el esquema de BD basándose en prisma/schema.prisma
npx prisma migrate dev

# O regenerar el cliente Prisma (si ya existe la BD)
npx prisma generate
```

### 4. Iniciar el servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm run start
```

El servidor estará disponible en `http://localhost:3000`

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

## 📋 Ejemplos de uso

### Crear tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi tarea", "description": "Descripción importante"}'
```

### Obtener todas las tareas
```bash
curl http://localhost:3000/api/tasks
```

### Actualizar tarea
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Eliminar tarea
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## 🗂️ Estructura del Proyecto

```
task-api-claude/
├── prisma/
│   ├── schema.prisma      # Esquema de BD (Prisma)
│   ├── migrations/        # Migraciones automáticas
│   └── seed.js            # Script para poblar datos (opcional)
├── src/
│   ├── config/
│   │   └── prisma.js      # Cliente Prisma configurado
│   ├── controllers/       # Lógica de negocio
│   ├── middlewares/       # Validaciones y manejo de errores
│   ├── models/            # Operaciones con BD (usando Prisma)
│   ├── routes/            # Definición de rutas
│   ├── app.js             # Configuración Express
│   └── server.js          # Punto de entrada
├── package.json           # Dependencias y scripts
├── prisma.config.ts       # Configuración de Prisma
├── .env                   # Variables de entorno (no versionar)
├── .env.example           # Ejemplo de variables
└── README.md              # Este archivo
```

## 🛠️ Scripts disponibles

```bash
# Desarrollo
npm run dev                    # Inicia con nodemon

# Producción
npm start                      # Inicia el servidor

# Prisma
npx prisma migrate dev         # Crear/aplicar migraciones
npx prisma migrate deploy      # Aplicar migraciones en producción
npx prisma studio             # Interfaz visual para la BD
npx prisma generate           # Regenerar cliente Prisma
```

## 🔄 Cambiar de rama

Si quieres probar otras configuraciones:

```bash
# Cambiar a rama con PostgreSQL local (sin Prisma)
git checkout postgres

# Cambiar a rama con SQLite (versión original)
git checkout sqlite

# Volver a main/develop (PostgreSQL + Neon + Prisma)
git checkout main
# o
git checkout develop
```

Cada rama tiene su propia configuración de dependencias y `.env` esperado.

## ⚙️ Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno (development/production) | `development` |
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://...` |

**Importante:** No subas el archivo `.env` al repositorio. Usa `.env.example` para documentar las variables necesarias.

## 🐛 Troubleshooting

### Error: "database does not exist"
```bash
# Crear la BD
npx prisma migrate deploy
```

### Error: "PrismaClient did not initialize yet"
```bash
# Regenerar cliente Prisma
npx prisma generate

# Luego reinicia la app
npm run dev
```

### Error: "@prisma/client connection timeout"
- Verifica que tu `DATABASE_URL` es correcta
- Comprueba que Neon está disponible
- Verifica los firewall/VPN

## 📚 Recursos útiles

- [Documentación Prisma](https://www.prisma.io/docs)
- [Neon - PostgreSQL Serverless](https://neon.tech)
- [Express.js Documentation](https://expressjs.com)
- [Zod - TypeScript-first schema validation](https://zod.dev)

## 📄 Licencia

MIT
