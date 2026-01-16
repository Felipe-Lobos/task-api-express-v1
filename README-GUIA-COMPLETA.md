# 📘 API REST con Express, PostgreSQL y Prisma - Guía Completa

## 🎯 Descripción del Proyecto

API REST profesional para gestión de tareas construida con las mejores prácticas de desarrollo backend moderno. Ideal para aprendizaje y proyectos personales.

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 4.21+ | Framework web |
| **PostgreSQL** | 15/16 | Base de datos |
| **Prisma** | 6.9.0 | ORM (Object-Relational Mapping) |
| **Zod** | 3.23+ | Validación de datos |
| **Helmet** | 8.0+ | Seguridad HTTP |
| **CORS** | 2.8+ | Cross-Origin Resource Sharing |

---

## 📦 Instalación y Configuración Inicial

### **1. Crear proyecto**

```bash
mkdir task-api
cd task-api
npm init -y
```

### **2. Instalar dependencias**

```bash
# Producción
npm install express dotenv cors helmet zod @prisma/client

# Desarrollo
npm install --save-dev nodemon prisma
```

### **3. Configurar package.json**

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "prisma:studio": "npx prisma studio",
    "prisma:generate": "npx prisma generate",
    "prisma:push": "npx prisma db push"
  }
}
```

### **4. Estructura de carpetas**

```bash
mkdir -p src/{config,controllers,middlewares,models,routes}
mkdir prisma
```

---

## 🗄️ Configuración de Base de Datos

### **Opción 1: PostgreSQL Local con DBngin**

1. Descargar [DBngin](https://dbngin.com)
2. Crear servidor PostgreSQL (puerto 5432)
3. Crear base de datos: `taskdb`

**Cadena de conexión:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskdb
```

### **Opción 2: PostgreSQL Cloud (Neon.tech)**

1. Registrarse en [neon.tech](https://neon.tech) (sin tarjeta)
2. Crear proyecto
3. Copiar cadena de conexión

**Ventajas de Neon:**
- ✅ 512MB gratis sin tarjeta
- ✅ Pausa automática (ahorro)
- ✅ Backups automáticos
- ✅ Dashboard visual

---

## 🔧 Configuración de Prisma

### **1. Inicializar Prisma**

```bash
npx prisma init
```

### **2. Definir Schema (`prisma/schema.prisma`)**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(100)
  description String?  @db.Text
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("tasks")
}
```

### **3. Generar cliente y sincronizar**

```bash
npx prisma generate
npx prisma db push
```

### **4. Ver base de datos visualmente**

```bash
npx prisma studio
```

Abre `http://localhost:5555` con interfaz gráfica de tu base de datos.

---

## 🏗️ Arquitectura del Proyecto

### **Patrón MVC Simplificado**

```
Cliente → Routes → Validators → Controllers → Models → Database
                      ↓
                 ErrorHandler
```

### **Estructura de archivos**

```
task-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.js           # Cliente de Prisma
│   ├── controllers/
│   │   └── taskController.js   # Lógica de negocio
│   ├── middlewares/
│   │   ├── errorHandler.js     # Manejo de errores
│   │   └── validators.js       # Validaciones con Zod
│   ├── models/
│   │   └── taskModel.js        # Queries a base de datos
│   ├── routes/
│   │   └── taskRoutes.js       # Definición de endpoints
│   ├── app.js                  # Configuración de Express
│   └── server.js               # Punto de entrada
├── .env
├── .gitignore
└── package.json
```

---

## 📝 Implementación de Componentes

### **Cliente de Prisma (`src/config/prisma.js`)**

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

export default prisma;
```

### **Modelo de Datos (`src/models/taskModel.js`)**

```javascript
import prisma from '../config/prisma.js';

const TaskModel = {
  getAll: async () => {
    return await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  getById: async (id) => {
    return await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });
  },

  create: async (taskData) => {
    return await prisma.task.create({ data: taskData });
  },

  update: async (id, taskData) => {
    return await prisma.task.update({
      where: { id: parseInt(id) },
      data: taskData
    });
  },

  delete: async (id) => {
    await prisma.task.delete({ where: { id: parseInt(id) } });
    return { deleted: true };
  }
};

export default TaskModel;
```

### **Validaciones con Zod (`src/middlewares/validators.js`)**

```javascript
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  description: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
  completed: z.boolean()
    .optional()
    .default(false)
});

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};
```

### **Controladores (`src/controllers/taskController.js`)**

```javascript
import TaskModel from '../models/taskModel.js';

export const taskController = {
  getAllTasks: async (req, res, next) => {
    try {
      const tasks = await TaskModel.getAll();
      res.json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  },

  createTask: async (req, res, next) => {
    try {
      const newTask = await TaskModel.create(req.validatedData);
      res.status(201).json({
        success: true,
        message: 'Tarea creada exitosamente',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  }
  
  // ... más métodos
};
```

### **Rutas (`src/routes/taskRoutes.js`)**

```javascript
import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { validate, createTaskSchema } from '../middlewares/validators.js';

const router = express.Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.put('/:id', validate(createTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
```

### **Manejo de Errores (`src/middlewares/errorHandler.js`)**

```javascript
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### **Configuración de Express (`src/app.js`)**

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando' });
});

app.use('/api/tasks', taskRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;
```

### **Servidor (`src/server.js`)**

```javascript
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 http://localhost:${PORT}`);
});
```

---

## 🌐 API Endpoints

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/health` | Health check | - |
| GET | `/api/tasks` | Obtener todas las tareas | - |
| GET | `/api/tasks/:id` | Obtener tarea por ID | - |
| POST | `/api/tasks` | Crear nueva tarea | `{ title, description?, completed? }` |
| PUT | `/api/tasks/:id` | Actualizar tarea | `{ title?, description?, completed? }` |
| DELETE | `/api/tasks/:id` | Eliminar tarea | - |

### **Ejemplos de uso**

```bash
# Crear tarea
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Aprender Prisma", "description": "Completar tutorial"}'

# Obtener todas
curl http://localhost:3000/api/tasks

# Actualizar
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Eliminar
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

## 🧪 Testing

### **Herramientas recomendadas:**

1. **Thunder Client** (extensión VS Code)
2. **Postman**
3. **curl** (línea de comandos)

### **Casos de prueba:**

```bash
# ✅ Crear tarea válida
# ❌ Crear sin título (error validación)
# ❌ Título muy largo (error validación)
# ✅ Obtener todas las tareas
# ✅ Obtener tarea específica
# ❌ Obtener tarea inexistente (404)
# ✅ Actualizar tarea
# ✅ Eliminar tarea
```

---

## 🚀 Despliegue

### **Opción Recomendada: Render.com**

**Ventajas:**
- ✅ Sin tarjeta de crédito
- ✅ 750 horas gratis/mes
- ✅ Deploy automático desde GitHub
- ✅ HTTPS incluido

**Pasos:**

1. **Subir a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/task-api.git
git push -u origin main
```

2. **Configurar en Render**
   - Crear cuenta en [render.com](https://render.com)
   - Conectar repositorio
   - Configurar:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Variables de entorno: `DATABASE_URL`, `NODE_ENV=production`

3. **Variables de entorno en producción**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
PORT=10000
```

---

## 📊 Comparativa de Servicios

### **Base de Datos PostgreSQL Gratuita**

| Servicio | Storage | Sin Tarjeta | Persistencia | Recomendación |
|----------|---------|-------------|--------------|---------------|
| **Neon** | 512MB | ✅ | ✅ Permanente | 🥇 Mejor para aprendizaje |
| **Supabase** | 500MB | ✅ | ✅ Permanente | 🥈 Si necesitas Auth/Storage |
| **Render** | 1GB | ❌ Requiere | ⚠️ 90 días | Solo si tienes tarjeta |

### **Hosting de API**

| Servicio | Precio | Sin Tarjeta | Cold Start | Recomendación |
|----------|--------|-------------|------------|---------------|
| **Render** | Gratis | ✅ | ~30s | 🥇 Mejor opción |
| **Fly.io** | Gratis | ⚠️ A veces pide | ~10s | 🥈 Alternativa |
| **Railway** | $5/mes | ❌ | Sin cold start | Solo si pagas |

---

## 🔐 Variables de Entorno

### **`.env` (desarrollo)**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskdb
```

### **`.env.example` (template)**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_postgresql_connection_string_here
```

### **`.gitignore`**
```
node_modules/
.env
*.log
.DS_Store
```

---

## 🛠️ Comandos Útiles

### **NPM Scripts**
```bash
npm run dev          # Desarrollo con hot reload
npm start            # Producción
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:push      # Sincronizar schema con BD
```

### **Prisma CLI**
```bash
npx prisma init              # Inicializar Prisma
npx prisma generate          # Generar cliente
npx prisma db push           # Aplicar cambios a BD
npx prisma db pull           # Obtener schema desde BD
npx prisma studio            # Interfaz visual
npx prisma migrate dev       # Crear migración
npx prisma migrate deploy    # Aplicar migraciones
npx prisma format            # Formatear schema
```

---

## 🎓 Mejores Prácticas Implementadas

### **Arquitectura**
- ✅ Separación de responsabilidades (MVC)
- ✅ Capa de modelo independiente
- ✅ Validaciones centralizadas
- ✅ Manejo de errores global

### **Seguridad**
- ✅ Helmet para headers HTTP
- ✅ CORS configurado
- ✅ Validación de entrada con Zod
- ✅ Variables de entorno para secretos
- ✅ Sin logs sensibles en producción

### **Base de Datos**
- ✅ ORM (Prisma) para queries seguras
- ✅ Migraciones versionadas
- ✅ Índices automáticos
- ✅ Timestamps automáticos

### **Código**
- ✅ ES Modules (import/export)
- ✅ Async/await consistente
- ✅ Try/catch para manejo de errores
- ✅ Código DRY (Don't Repeat Yourself)

---

## 📚 Próximos Pasos (Opcional)

### **Nivel Intermedio**
1. Agregar autenticación JWT
2. Implementar paginación
3. Agregar filtros y búsqueda
4. Rate limiting
5. Tests unitarios (Jest/Vitest)

### **Nivel Avanzado**
6. Migraciones de Prisma
7. Relaciones entre modelos (Users ↔ Tasks)
8. Upload de archivos
9. WebSockets (real-time)
10. Docker y Docker Compose
11. CI/CD con GitHub Actions
12. Documentación con Swagger

---

## 🔍 Troubleshooting

### **Error: Cannot find module '@prisma/client'**
```bash
npx prisma generate
```

### **Error: Database connection failed**
```bash
# Verificar DATABASE_URL en .env
# Verificar que PostgreSQL está corriendo
# Probar conexión: npx prisma db push
```

### **Error: Port already in use**
```bash
# Cambiar PORT en .env
# O matar proceso: npx kill-port 3000
```

### **Prisma Schema changes not reflected**
```bash
npx prisma generate
npx prisma db push
```

---

## 📖 Recursos Adicionales

- **Documentación Prisma:** https://www.prisma.io/docs
- **Express.js:** https://expressjs.com
- **Zod:** https://zod.dev
- **PostgreSQL:** https://www.postgresql.org/docs
- **Neon:** https://neon.tech/docs
- **Render:** https://render.com/docs

---

## 📄 Licencia

MIT

---

## 👤 Autor

Tu Nombre - [@tu-usuario](https://github.com/tu-usuario)

---

**⭐ Si te fue útil, dale una estrella al repositorio**