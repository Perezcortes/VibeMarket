/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 4 - Soporte Técnico
 * Historia de Usuario: US014-A Sistema de tickets de soporte
 * AUTOR (Responsable): Zaeimind Navarrete
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { PrismaClient, TicketStatus, TicketPriority } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTicketInput {
  user_id: string;
  subject: string;
  message: string;
  priority?: TicketPriority;
}

export const createTicket = async (data: CreateTicketInput) => {
  // 1. Validar que el usuario exista
  const userExists = await prisma.user.findUnique({
    where: { id: data.user_id },
  });

  if (!userExists) {
    throw new Error("No se puede crear el ticket: El usuario no existe.");
  }

  // 2. Crear el ticket con estado inicial 'abierto'
  return await prisma.supportTicket.create({
    data: {
      user_id: data.user_id,
      subject: data.subject,
      message: data.message,
      priority: data.priority || TicketPriority.media,
      status: TicketStatus.abierto,
    },
  });
};