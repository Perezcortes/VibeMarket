/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 4 - Soporte Técnico
 * Historia de Usuario: US014-B Log de incidencias técnicas
 * AUTOR (Responsable): Zaeimind Navarrete
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { PrismaClient, TicketPriority, TicketStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateIncidentInput {
  title: string;
  description: string;
  priority: TicketPriority;
  reported_by: string; // ID del usuario de soporte
}

export const createTechnicalIncident = async (data: CreateIncidentInput) => {
  // 1. Validar que el reportero (staff) exista en el modelo 'User'
  const reporterExists = await prisma.user.findUnique({
    where: { id: data.reported_by },
  });

  if (!reporterExists) {
    throw new Error("No se puede registrar la incidencia: El reportero no existe.");
  }

  // 2. Registrar en el modelo 'TechnicalIncident'
  return await prisma.technicalIncident.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      reported_by: data.reported_by,
      status: TicketStatus.abierto, // Estado inicial por defecto
    },
  });
};