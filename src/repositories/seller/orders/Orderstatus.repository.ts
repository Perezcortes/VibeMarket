import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

/**
 * US003-B: Editar el estado de los pedidos.
 * "Como vendedor, quiero cambiar el estado del pedido (pendiente, enviado, entregado),
 * para saber en qué parte del proceso va el pedido."
 */
export const OrderPersistenceRepository = {

  /**
   * Actualiza el campo 'status' en la tabla 'orders'
   */
  async updateStatus(orderId: string, newStatus: OrderStatus) {
    return prisma.order.update({
      where: { 
        id: orderId 
      },
      data: { 
        status: newStatus 
      }
    });
  },

  /**
   * Inserta un nuevo registro en la tabla 'order_status_history'.
   */
  async createStatusHistory(orderId: string, status: OrderStatus, sellerId: string) {
    return prisma.orderStatusHistory.create({
      data: {
        order_id: orderId,
        status: status,
        changed_by: sellerId // Aquí asumimos que el vendedor es quien hace el cambio de estado
      }
    });
  }
};