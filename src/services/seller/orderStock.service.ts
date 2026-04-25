/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Gestión de InventariO
 * Historia de Usuario: US002-B: Decremento automático de stock
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari
 * FECHA: 5 de marzo de 2026
 */

import { OrderStockRepository } from "@/repositories/seller/stock/orderStock.repository";

// Aquí inicia la lógica de la capa de servicio
export class OrderStockService {
  
  /**
   * Procesa la reducción de inventario tras confirmar una compra.
   * @param orderId Identificador único del pedido.
   */
  async processStockReduction(orderId: string) {
    if (!orderId) {
      throw new Error("El ID del pedido es obligatorio.");
    }

    try {
      // 1. Log de auditoría interna
     // console.info(`[OrderStockService]: Procesando decremento para Orden ID: ${orderId}`);

      // 2. Ejecución delegada al repositorio
      const updatedProducts = await OrderStockRepository.decrementStockOnPurchase(orderId);

      // 3. Validación de resultados
      if (!updatedProducts || updatedProducts.length === 0) {
        return {
          message: "No se requirieron ajustes de stock (orden vacía o ya procesada).",
          count: 0
        };
      }

      return {
        success: true,
        message: "Stock actualizado correctamente y alertas verificadas.",
        updatedItemsCount: updatedProducts.length
      };

    } catch (error) {
      // 4. Captura de errores de base de datos o lógica de negocio
      console.error(`[OrderStockService Error]:`, error);
      
      throw new Error(
        error instanceof Error 
          ? `Error al actualizar stock: ${error.message}` 
          : "Error interno desconocido en el servicio de stock."
      );
    }
  }
}

// Exportamos una instancia única (Singleton) o la clase según prefieras
export const orderStockService = new OrderStockService();