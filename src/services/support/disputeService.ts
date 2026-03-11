/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 4 - Soporte Técnico
 * Historia de Usuario: US014-C Módulo de mediación de disputas
 * AUTOR (Responsable): Zaeimind Navarrete
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ResolveDisputeInput {
  disputeId: string;
  resolution: string;
  moderator_id: string;
}

export const resolveDispute = async (data: ResolveDisputeInput) => {
  // 1. Verificar que la disputa exista
  const dispute = await prisma.dispute.findUnique({
    where: { id: data.disputeId },
  });

  if (!dispute) {
    throw new Error("No se encontró la disputa especificada.");
  }

  // 2. Actualizar la disputa con la mediación del soporte
  return await prisma.dispute.update({
    where: { id: data.disputeId },
    data: {
      resolution: data.resolution,
      moderator_id: data.moderator_id,
      status: "resuelta", // Estado final tras la mediación
    },
  });
};