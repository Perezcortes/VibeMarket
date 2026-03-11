/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 4 - Soporte Técnico
 * Historia de Usuario: US014-B Log de incidencias técnicas
 * AUTOR (Responsable): Zaeimind Navarrete
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { createTechnicalIncident } from '../../../src/services/support/incidentService';
import { PrismaClient } from '@prisma/client';

// Mockeo interno para evitar problemas de inicialización
jest.mock('@prisma/client', () => {
  const mockInternal = {
    user: { findUnique: jest.fn() },
    technicalIncident: { create: jest.fn() },
  };
  return {
    PrismaClient: jest.fn(() => mockInternal),
    TicketPriority: { media: 'media', alta: 'alta', critica: 'critica' },
    TicketStatus: { abierto: 'abierto' }
  };
});

describe('US014-B: Pruebas Unitarias - Log de Incidencias', () => {
  const prisma = new PrismaClient() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe registrar una incidencia técnica exitosamente', async () => {
    // Simulamos reportero válido
    prisma.user.findUnique.mockResolvedValue({ id: 'STAFF-001' });
    
    // Simulamos creación exitosa
    prisma.technicalIncident.create.mockResolvedValue({
      id: 'INC-999',
      title: 'Fallo en pasarela',
      status: 'abierto'
    });

    const result = await createTechnicalIncident({
      title: 'Fallo en pasarela',
      description: 'Error 500 al procesar pagos con tarjeta',
      priority: 'critica' as any,
      reported_by: 'STAFF-001'
    });

    expect(result.id).toBe('INC-999');
    expect(prisma.technicalIncident.create).toHaveBeenCalled();
  });

  it('Debe fallar si el reportero no existe en la base de datos', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(createTechnicalIncident({
      title: 'Test',
      description: 'Test',
      priority: 'baja' as any,
      reported_by: 'INVALID-ID'
    })).rejects.toThrow("No se puede registrar la incidencia: El reportero no existe.");
  });
});