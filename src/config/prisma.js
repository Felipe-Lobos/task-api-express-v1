import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Evento de conexion
prisma
  .$connect()
  .then(() => console.log("✅ Conectado a PostgreSQL con Prisma"))
  .catch((err) => console.error("❌ Error al conectar con Prisma:", err));

//manejo de cierre graceful
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});


export default prisma;