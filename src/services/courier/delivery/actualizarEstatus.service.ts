/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Lógistica / Reparto
 * Historia de Usuario: US016-E: Como repartidor, quiero actualizar 
 * el estatus del pedido, para asegurar el proceso.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 8 de marzo de 2026
 */

import { ActualizarEstatusRepository } from "@/repositories/courier/delivery/actualizarEstatus.repository";
import { OrderStatus } from "@prisma/client";

// Aquí inicia la lógica de la capa de servicio
export class ActualizarEstatusService {
  
  /**
   * Actualiza el estatus del pedido a "entregado" o "en camino" según corresponda.
   * @param orderId Identificador del pedido (UUID).
   * @param status Nuevo estatus del pedido ("entregado" o "en camino").
   */
  async updateOrderStatus(orderId: string, status: string) {
    if (!orderId) {
      throw new Error("Se requiere un ID de pedido válido para actualizar el estatus.");
    }
    if (!["entregado", "enviado"].includes(status)) {
      throw new Error("El estatus debe ser 'entregado' o 'enviado'.");
    }

    try {
      // Llamamos al repositorio para actualizar el estatus del pedido
      const estatusValidado = status as OrderStatus;
      await ActualizarEstatusRepository.updateOrderStatus(orderId, estatusValidado);
//await ActualizarEstatusRepository.updateOrderStatus(orderId, newStatus);
      
      return {
        success: true,
        message: `El estatus del pedido ${orderId} se ha actualizado a ${status}.`
      };
    } catch (error) {
      // Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al actualizar el estatus del pedido.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
