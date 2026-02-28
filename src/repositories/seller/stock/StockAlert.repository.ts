import { prisma } from "@/lib/prisma";

/**
 * US002-C: Creación de alerta de stock bajo
 * Detecta si un producto necesita resurtido basándose en un umbral.
 */
export const StockAlertRepository = {
  /**
   * Verifica el stock y retorna si se debe disparar una alerta.
   */
  async checkAndTriggerLowStockAlert(productId: string, threshold: number = 5) {
    // 1. Consulta optimizada del estado del producto
    const product = await prisma.product.findUnique({
      where: { 
        id: productId 
      },
      select: {
        id: true,
        name: true,
        stock: true,
        seller_id: true,
        is_active: true
      }
    });

    // 2. Evaluación de criterios en la capa de datos
    if (product && product.is_active && product.stock <= threshold) {
      // Aquí iría la persistencia de la notificación si fuera necesario
      return true; // Estado crítico detectado
    }

    return false; // Stock suficiente
  }
};