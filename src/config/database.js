import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta a la base de datos
const DB_PATH = process.env.DB_PATH || join(__dirname, '../../database.db');

// Crear conexión a SQLite (síncrona)
const db = new Database(DB_PATH, { 
  verbose: process.env.NODE_ENV === 'development' ? console.log : null 
});

console.log('✅ Conectado a SQLite (better-sqlite3)');

// Crear tabla de tareas si no existe
const createTasksTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    db.exec(sql);
    console.log('✅ Tabla tasks lista');
  } catch (err) {
    console.error('❌ Error al crear tabla tasks:', err.message);
  }
};

// Inicializar base de datos
createTasksTable();

export default db;