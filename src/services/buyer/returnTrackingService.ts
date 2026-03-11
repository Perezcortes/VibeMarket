/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Comprador (Devoluciones)
 * Historia de Usuario: US013-C Tracking de estatus de devolución
 * AUTOR (Responsable): Zaeimind Navarrete.
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getReturnTracking = async (requestId: string) => {
  // Buscamos la solicitud en el modelo 'ReturnRequest'
  const trackingInfo = await prisma.returnRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      reason: true
    }
  });

  if (!trackingInfo) {
    throw new Error("No se encontró información de seguimiento para esta solicitud.");
  }

  // XP: Diseño Simple - Retornamos los datos necesarios para la vista de monitoreo
  return {
    trackingId: trackingInfo.id,
    status: trackingInfo.status,
    lastUpdate: trackingInfo.updatedAt,
    message: `Tu solicitud se encuentra actualmente en estado: ${trackingInfo.status}`
  };
};