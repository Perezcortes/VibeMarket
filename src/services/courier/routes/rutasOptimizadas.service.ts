/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Lógistica / Reparto
 * Historia de Usuario: US016-D: Como repartidor, quiero gestionar 
 * mis rutas diarias para optimizar tiempo.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 7 de marzo de 2026
 */

import { RutasOptimizadasRepository } from "@/repositories/courier/routes/rutasOptimizadas.repository";

// Aquí inicia la lógica de la capa de servicio
export class RutasOptimizadasService {
  
  /**
   * Obtiene los pedidos pendientes de un repartidor junto con los datos de la dirección
   * para poder calcular la ruta óptima.
   * @param courierId Identificador del repartidor (UUID).
   */
  async getPendingOrdersWithAddress(courierId: string) {
    if (!courierId) {
      throw new Error("Se requiere un ID de repartidor válido para obtener los pedidos pendientes.");
    }

    try {
      // Llamamos al repositorio para obtener los pedidos pendientes con dirección
      const orders = await RutasOptimizadasRepository.getPendingOrdersWithAddress(courierId);
      
      return {
        success: true,
        message: `Se encontraron ${orders.length} pedidos pendientes con dirección.`,
        data: orders
      };
    } catch (error) {
      // Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al obtener los pedidos pendientes con dirección.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}