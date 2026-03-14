/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Devoluciones
 * Historia de Usuario: US013-D Notificación de devolución finalizada
 * DESCRIPCIÓN: Valida que la notificación solo se genere en estado COMPLETED.
 * AUTOR (Responsable): Marin
 * COPILOTO (XP Pair): [Nombre del Copiloto]
 * FECHA: 07/03/2026
 */

import { getCompletionNotification } from '../../../src/services/buyer/returnNotificationService';
import { PrismaClient } from '@prisma/client';

// Mockeo interno blindado contra ReferenceError
jest.mock('@prisma/client', () => {
  const internalMock = {
    returnRequest: {
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => internalMock),
    ReturnStatus: {
      PENDING: 'PENDING',
      COMPLETED: 'COMPLETED'
    }
  };
});

describe('US013-D: Pruebas Unitarias - Notificaciones', () => {
  const prisma = new PrismaClient() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe generar notificación positiva cuando el estado es COMPLETED', async () => {
    // Simulamos una solicitud finalizada
    prisma.returnRequest.findUnique.mockResolvedValue({
      id: 'REQ-FINAL',
      orderId: 'ORD-999',
      status: 'COMPLETED'
    });

    const result = await getCompletionNotification('REQ-FINAL');

    expect(result.notified).toBe(true);
    expect(result.title).toBe("¡Devolución Completada!");
  });

  it('No debe notificar si la devolución sigue pendiente', async () => {
    prisma.returnRequest.findUnique.mockResolvedValue({
      id: 'REQ-PENDING',
      status: 'PENDING'
    });

    const result = await getCompletionNotification('REQ-PENDING');

    expect(result.notified).toBe(false);
    expect(result.message).toContain("en proceso");
  });
});