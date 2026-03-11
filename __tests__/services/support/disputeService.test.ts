/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 4 - Soporte Técnico
 * Historia de Usuario: US014-C Módulo de mediación de disputas
 * AUTOR (Responsable): Zaeimind Navarrete
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { resolveDispute } from '../../../src/services/support/disputeService';
import { PrismaClient } from '@prisma/client';

// Mockeo interno para evitar ReferenceError y problemas de conexión
jest.mock('@prisma/client', () => {
  const mockInternal = {
    dispute: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockInternal),
  };
});

describe('US014-C: Pruebas Unitarias - Mediación de Disputas', () => {
  const prisma = new PrismaClient() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe resolver una disputa correctamente como mediador', async () => {
    // Simulamos disputa existente
    prisma.dispute.findUnique.mockResolvedValue({ id: 'DISP-123', status: 'abierta' });
    
    // Simulamos actualización exitosa
    prisma.dispute.update.mockResolvedValue({
      id: 'DISP-123',
      status: 'resuelta',
      resolution: 'Reembolso parcial aprobado'
    });

    const result = await resolveDispute({
      disputeId: 'DISP-123',
      resolution: 'Reembolso parcial aprobado',
      moderator_id: 'MOD-001'
    });

    expect(result.status).toBe('resuelta');
    expect(prisma.dispute.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        moderator_id: 'MOD-001'
      })
    }));
  });

  it('Debe fallar si la disputa no existe', async () => {
    prisma.dispute.findUnique.mockResolvedValue(null);

    await expect(resolveDispute({
      disputeId: 'FAKE-ID',
      resolution: 'N/A',
      moderator_id: 'MOD-001'
    })).rejects.toThrow("No se encontró la disputa especificada.");
  });
});