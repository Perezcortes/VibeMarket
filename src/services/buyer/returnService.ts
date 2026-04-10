/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Comprador (Devoluciones)
 * Historia de Usuario: US013-A Solicitud de devoluciones
 * AUTOR (Responsable): Zaeimind Navarrete.
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { PrismaClient, ReturnStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface ReturnRequestInput {
  orderId: string;
  reason: string;
  description?: string;
}

export const createReturnRequest = async (data: ReturnRequestInput) => {
  // 1. Verificación: El modelo 'Order' existe y buscamos por su 'id'
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
  });

  if (!order) {
    throw new Error("No se puede solicitar devolución: La orden no existe.");
  }

  // 2. Persistencia: Usamos el modelo 'ReturnRequest' y el campo 'orderId'
  return await prisma.returnRequest.create({
    data: {
      orderId: data.orderId,
      reason: data.reason,
      description: data.description || "",
      status: ReturnStatus.PENDING, // Valor correcto según enum ReturnStatus
    },
  });
};