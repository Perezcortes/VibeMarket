/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Lógistica / Reparto
 * Historia de Usuario: US016-C: Como repartidor, quiero liquidar
 *  pedidos entregados para cerrar mi turno.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 7 de marzo de 2026
 */

import { LiquidarRepartosRepository } from "@/repositories/courier/shift/liquidarRepartos.repository";

// Aquí inicia la lógica de la capa de servicio
export class LiquidarRepartoService {
  
  /**
   * Obtiene los pedidos que el repartidor debe liquidar (estado 'enviado').
   * @param courierId Identificador del repartidor (UUID).
   */
  async getOrdersToLiquidate(courierId: string) {
    if (!courierId) {
      throw new Error("Se requiere un ID de repartidor válido para obtener los pedidos a liquidar.");
    }

    try {
      // Llamamos al repositorio para obtener los pedidos a liquidar
      const orders = await LiquidarRepartosRepository.getOrdersToLiquidate(courierId);
      
      return {
        success: true,
        message: `Se encontraron ${orders.length} pedidos para liquidar.`,
        data: orders
      };
    } catch (error) {
      // Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al obtener los pedidos a liquidar.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Marca un pedido como entregado (liquidar el pedido).
   * @param orderId Identificador del pedido (UUID).
   */
  async markOrderAsDelivered(orderId: string) {
    if (!orderId) {
      throw new Error("Se requiere un ID de pedido válido para marcar como entregado.");
    }

    try {
      // Llamamos al repositorio para marcar el pedido como entregado
      const updatedOrder = await LiquidarRepartosRepository.markOrderAsDelivered(orderId);
      
      return {
        success: true,
        message: `El pedido con ID ${orderId} ha sido marcado como entregado.`,
        data: updatedOrder
      };
    } catch (error) {
      // Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al marcar el pedido como entregado.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

