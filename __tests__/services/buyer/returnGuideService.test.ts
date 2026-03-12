/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Devoluciones
 * Historia de Usuario: US013-B Guía de proceso de retorno
 * DESCRIPCIÓN: Valida que la guía se genere correctamente para solicitudes existentes.
 * AUTOR (Responsable): Marin
 * COPILOTO (XP Pair): [Nombre del Copiloto]
 * FECHA: 07/03/2026
 */

import { getReturnInstructions } from '../../../src/services/buyer/returnGuideService';
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
  };
});

describe('US013-B: Pruebas Unitarias - Guía de Retorno', () => {
  const prisma = new PrismaClient() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe devolver la guía de pasos cuando la solicitud es válida', async () => {
    // Simulamos que la solicitud existe con estado PENDING
    prisma.returnRequest.findUnique.mockResolvedValue({
      id: 'REQ-456',
      status: 'PENDING'
    });

    const result = await getReturnInstructions('REQ-456');

    expect(result.instructions.length).toBeGreaterThan(0);
    expect(result.currentStatus).toBe('PENDING');
    expect(result.instructions[0]).toContain("empaque original");
  });

  it('Debe lanzar error si la solicitud no existe', async () => {
    prisma.returnRequest.findUnique.mockResolvedValue(null);

    await expect(getReturnInstructions('NON-EXISTENT'))
      .rejects.toThrow("No se encontró la solicitud de devolución.");
  });
});