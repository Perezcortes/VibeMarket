/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Gestión de Inventario / Alertas
 * Historia de Usuario: US002-C: Creación de alerta de stock bajo
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari Ariadna Ramirez
 * FECHA: 5 de marzo de 2026
 */

import { StockAlertRepository } from "@/repositories/seller/stock/StockAlert.repository";

// Aquí inicia la lógica de la capa de servicio
export class StockAlertService {
  
  /**
   * Evalúa si un producto requiere atención inmediata por bajo inventario.
   * @param productId Identificador del producto.
   * @param threshold Umbral personalizado (opcional).
   */
  async evaluateProductStock(productId: string, threshold?: number) {
    if (!productId) {
      throw new Error("Se requiere un ID de producto válido para evaluar alertas.");
    }

    try {
      // 1. Consulta a la capa de persistencia
      const isCritical = await StockAlertRepository.checkAndTriggerLowStockAlert(productId, threshold);

      // 2. Lógica de Negocio: ¿Qué hacemos si el stock es crítico?
      if (isCritical) {
       console.warn(`[StockAlertService]: El producto ${productId} requiere resurtido inmediato.`);
        
        return {
          alertTriggered: true,
          level: "CRITICAL",
          actionRequired: "RESTOCK_NOW",
          timestamp: new Date().toISOString()
        };
      }

      // 3. Flujo normal: El stock es suficiente
      return {
        alertTriggered: false,
        level: "NORMAL",
        message: "El inventario se encuentra en niveles óptimos."
      };

    } catch (error) {
      console.error(`[StockAlertService Error]: Falló la evaluación para el producto ${productId}`, error);
      
      throw new Error(
        error instanceof Error 
          ? `Error en validación de alertas: ${error.message}` 
          : "Error interno al procesar alertas de stock."
      );
    }
  }
}

// Exportamos
export const stockAlertService = new StockAlertService();
