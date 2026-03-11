/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Comprador (Devoluciones)
 * Historia de Usuario: US013-D Notificación de devolución finalizada
 * AUTOR (Responsable): Zaeimind Navarrete.
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { PrismaClient, ReturnStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getCompletionNotification = async (requestId: string) => {
  // Buscamos la solicitud en el modelo 'ReturnRequest'
  const request = await prisma.returnRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Solicitud de devolución no encontrada.");
  }

  // Lógica de negocio: Solo notificar si el estado es COMPLETED
  if (request.status !== ReturnStatus.COMPLETED) {
    return {
      notified: false,
      message: "La devolución aún está en proceso."
    };
  }

  return {
    notified: true,
    title: "¡Devolución Completada!",
    message: `Tu solicitud para la orden ${request.orderId} ha sido finalizada con éxito. El reembolso ha sido procesado.`,
    timestamp: new Date()
  };
};