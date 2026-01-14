import pg from "pg";
const { Pool } = pg;

// Crear pool de conexion
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para Neon y otros servicios cloud
  },
  // Configuración opcional para mejor rendimiento
  max: 20, //maximo de conexiones
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Evento de conexion exitosa
pool.on("connect", () => {
  console.log("✅ Conectado a PostgreSQL (Neon)");
});

// Evento de error
pool.on("error", (err) => {
  console.error("❌ Error inesperado en PostgreSQL:", err);
});

const createTaskTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(sql);
    console.log("✅ Tabla tasks lista");
  } catch (err) {
    console.error("❌ Error al crear tabla tasks:", err.message);
  }
};

// Iniciar base de datos
createTaskTable();

export default pool;
