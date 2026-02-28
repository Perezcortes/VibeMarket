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
  static async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }
}