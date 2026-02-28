import { registrarIncidencia } from "@/repositories/support/incidencias";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Prueba Unitaria - US014-B: Registro de Incidencia", () => {
  it("Debe insertar una incidencia técnica con un usuario real", async () => {
    // Buscamos el primer usuario que exista (creado por el seed)
    const usuarioReal = await prisma.user.findFirst();
    
    if (!usuarioReal) throw new Error("No hay usuarios en la base de datos. Ejecuta npx prisma db seed");

    const datosDePrueba = {
      titulo: "Error de Conexión DB",
      descripcion: "Fallo en el pool de conexiones",
      prioridad: "alta" as const,
      usuarioId: usuarioReal.id // Usamos un ID que SÍ existe
    };

    const resultado = await registrarIncidencia(datosDePrueba);
    expect(resultado).toHaveProperty("id");
    expect(resultado.reported_by).toBe(usuarioReal.id);
  });
});