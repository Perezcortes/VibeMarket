import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
/**
 * US0016-E: Actualización de estatus de entrega
 * "Como repartidor, quiero actualizar el estatus del pedido, para asegurar el proceso."
 */
export class ActualizarEstatusRepository {
  /**
   * Obtiene los pedidos del repartidor que están en curso
   * (pendiente, pagado o enviado).
   */
  static async getActiveOrders(courierId: string) {
    return await prisma.order.findMany({
      where: {
        courier_id: courierId,
        // Usamos 'in' para buscar múltiples estados a la vez
        status: {
          in: ['pendiente', 'pagado', 'enviado'],
        },
      },
    });
  }

  /**
   * Actualiza el estado de un pedido específico en la base de datos.
   */
  // En tu archivo: actualizarEstatus.repository.ts
  static async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    return await prisma.$transaction([
      // 1. Actualiza el pedido
      prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      }),
      // 2. Crea el registro en el historial (Igual que en la US016-C)
      prisma.orderStatusHistory.create({
        data: {
          order_id: orderId,
          status: newStatus,
          //changedBy: "Repartidor (Manual)",
        },
      }),
    ]);
  }
}