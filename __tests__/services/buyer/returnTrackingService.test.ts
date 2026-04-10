/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Devoluciones
 * Historia de Usuario: US013-C Tracking de estatus de devolución
 * DESCRIPCIÓN: Valida que el sistema de tracking retorne la información de estatus correcta.
 * AUTOR (Responsable): Marin
 * COPILOTO (XP Pair): [Nombre del Copiloto]
 * FECHA: 07/03/2026
 */

import { getReturnTracking } from '../../../src/services/buyer/returnTrackingService';
import { PrismaClient } from '@prisma/client';

// Mockeo interno para evitar ReferenceError y problemas de conexión
jest.mock('@prisma/client', () => {
  const internalMock = {
    returnRequest: {
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => internalMock),
  };
});

describe('US013-C: Pruebas Unitarias - Tracking de Devolución', () => {
  const prisma = new PrismaClient() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe retornar los datos de seguimiento cuando la solicitud existe', async () => {
    const mockDate = new Date();
    // Simulamos respuesta del modelo conforme al schema
    prisma.returnRequest.findUnique.mockResolvedValue({
      id: 'REQ-TRACK-1',
      status: 'APPROVED',
      updatedAt: mockDate,
      reason: 'Defecto'
    });

    const result = await getReturnTracking('REQ-TRACK-1');

    expect(result.status).toBe('APPROVED');
    expect(result.trackingId).toBe('REQ-TRACK-1');
    expect(result.lastUpdate).toBe(mockDate);
  });

  it('Debe lanzar error si el ID de seguimiento no es válido', async () => {
    prisma.returnRequest.findUnique.mockResolvedValue(null);

    await expect(getReturnTracking('INVALID-ID'))
      .rejects.toThrow("No se encontró información de seguimiento para esta solicitud.");
  });
});