import { prisma } from "@/lib/prisma";
import { StockAlertRepository } from "./StockAlert.repository";

/**
 * US002-B: Decremento automático de stock
 * Maneja la actualización física del inventario tras una compra.
 */
export const OrderStockRepository = {
  
  async decrementStockOnPurchase(orderId: string) {
    // 1. Obtención de ítems del pedido desde la BD
    const orderItems = await prisma.orderItem.findMany({
      where: { 
        order_id: orderId 
      }
    });

    // 2. Preparación de actualizaciones atómicas de stock
    const stockUpdates = orderItems.map((item) =>
      prisma.product.update({
        where: { id: item.product_id },
        data: {
          stock: {
            decrement: item.quantity
          }
        },
        select: { id: true } 
      })
    );

    // 3. Ejecución de la transacción en la base de datos
    const updatedProducts = await prisma.$transaction(stockUpdates);

    // 4. Invocación de la validación de alertas (US002-C)
    for (const product of updatedProducts) {
      await StockAlertRepository.checkAndTriggerLowStockAlert(product.id);
    }

    return updatedProducts;
  }
};