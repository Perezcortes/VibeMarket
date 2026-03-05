/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 3 - Comprador (Devoluciones)
 * Historia de Usuario: US013-A Solicitud de devoluciones
 * AUTOR (Responsable): [Tu Nombre]
 * COPILOTO (XP Pair): [Nombre del Copiloto]
 * FECHA: 04/03/2026 
 */

import { createReturnRequest } from '../../../src/services/buyer/returnService';

describe('Pruebas Unitarias - US013-A', () => {
  it('Debe inicializar la solicitud de devolución con estado PENDING', async () => {
    const result = await createReturnRequest("ORD-123", "Defecto de fábrica");
    expect(result.status).toBe("PENDING");
  });
});