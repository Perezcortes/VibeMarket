/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Comprador (Devoluciones)
 * Historia de Usuario: US013-A Solicitud de devoluciones
 * AUTOR (Responsable): [Tu Nombre]
 * COPILOTO (XP Pair): [Nombre del Copiloto]
 * FECHA: 04/03/2026 
 */

import { createReturnRequest } from '../../../src/services/buyer/returnService';
import { PrismaClient } from '@prisma/client';

// SOLUCIÓN AL REFERENCE ERROR: Definimos el mock sin usar variables externas
jest.mock('@prisma/client', () => {
  const mockInternalPrisma = {
    order: {
      findUnique: jest.fn(),
    },
    returnRequest: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockInternalPrisma),
    ReturnStatus: {
      PENDING: 'PENDING',
      APPROVED: 'APPROVED',
      REJECTED: 'REJECTED',
      COMPLETED: 'COMPLETED'
    }
  };
});

describe('US013-A: Pruebas Unitarias - Capa de Servicio', () => {
  // Obtenemos la instancia mockeada
  const prisma = new PrismaClient() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe registrar exitosamente una devolución si la orden existe', async () => {
    // Simulamos que la orden sí existe en la DB
    prisma.order.findUnique.mockResolvedValue({ id: 'ORD-123' });
    
    // Simulamos la creación de la solicitud
    prisma.returnRequest.create.mockResolvedValue({
      id: 'cl_12345',
      orderId: 'ORD-123',
      status: 'PENDING'
    });

    const result = await createReturnRequest({
      orderId: 'ORD-123',
      reason: 'Producto defectuoso'
    });

    expect(result.status).toBe('PENDING');
    expect(prisma.returnRequest.create).toHaveBeenCalled();
  });

  it('Debe lanzar un error si la orden no existe', async () => {
    // Simulamos que la orden no existe
    prisma.order.findUnique.mockResolvedValue(null);

    await expect(createReturnRequest({
      orderId: 'ORD-999',
      reason: 'No me gustó'
    })).rejects.toThrow("No se puede solicitar devolución: La orden no existe.");
  });
});