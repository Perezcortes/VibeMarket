import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Registra una nueva incidencia técnica en la base de datos.
 */
export const registrarIncidencia = async (data: {
  titulo: string;
  descripcion: string;
  prioridad: "baja" | "media" | "alta" | "critica";
  usuarioId: string;
}) => {
  return await prisma.technicalIncident.create({
    data: {
      title: data.titulo,
      description: data.descripcion,
      priority: data.prioridad,
      reported_by: data.usuarioId,
    },
  });
};

/**
 * Obtiene todas las incidencias registradas, de la más reciente a la más antigua.
 */
export const obtenerIncidencias = async () => {
  return await prisma.technicalIncident.findMany({
    include: {
      reporter: {
        select: { full_name: true, email: true }
      }
    },
    orderBy: { created_at: "desc" },
  });
};