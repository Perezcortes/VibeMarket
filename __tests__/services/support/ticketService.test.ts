/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 4 - Soporte Técnico
 * Historia de Usuario: US014-A Sistema de tickets de soporte
 * AUTOR (Responsable): Zaeimind Navarrete
 * COPILOTO (XP Pair): Leonides Lopez Robles.
 * FECHA: 04/03/2026 
 */

import { createTicket } from '../../../src/services/support/ticketService';
import { PrismaClient } from '@prisma/client';

// Mockeo interno para evitar ReferenceError y problemas de hoisting
jest.mock('@prisma/client', () => {
  const mockPrismaInternal = {
    user: { findUnique: jest.fn() },
    supportTicket: { create: jest.fn() },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaInternal),
    TicketStatus: { abierto: 'abierto' },
    TicketPriority: { media: 'media', alta: 'alta' }
  };
});

describe('US014-A: Pruebas Unitarias - Sistema de Tickets', () => {
  const prisma = new PrismaClient() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe crear un ticket exitosamente si el usuario es válido', async () => {
    // Simulamos usuario existente
    prisma.user.findUnique.mockResolvedValue({ id: 'USER-123', full_name: 'Marin' });
    
    // Simulamos creación de ticket
    prisma.supportTicket.create.mockResolvedValue({
      id: 'TICK-001',
      subject: 'Problema con mi envío',
      status: 'abierto'
    });

    const result = await createTicket({
      user_id: 'USER-123',
      subject: 'Problema con mi envío',
      message: 'No ha llegado mi paquete después de 3 días.'
    });

    expect(result.status).toBe('abierto');
    expect(prisma.supportTicket.create).toHaveBeenCalled();
  });

  it('Debe fallar si el usuario que intenta crear el ticket no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(createTicket({
      user_id: 'USER-FAKE',
      subject: 'Ayuda',
      message: 'Test'
    })).rejects.toThrow("No se puede crear el ticket: El usuario no existe.");
  });
});