/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Comprador (Devoluciones)
 * Historia de Usuario: US013-B Guía de proceso de retorno
 * AUTOR (Responsable): Zaeimind Navarrete
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 04/03/2026 
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getReturnInstructions = async (requestId: string) => {
  // Buscamos la solicitud en el modelo 'ReturnRequest'
  const request = await prisma.returnRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("No se encontró la solicitud de devolución.");
  }

  // XP: Diseño Simple - Retornamos la guía basada en el estado actual
  const guide = {
    requestId: request.id,
    currentStatus: request.status,
    instructions: [
      "Verifica que el producto esté en su empaque original.",
      "Imprime la etiqueta de envío generada en tu perfil.",
      "Acude a la sucursal de mensajería más cercana antes de 48 horas."
    ],
    supportContact: "soporte@vibemarket.com"
  };

  return guide;
};