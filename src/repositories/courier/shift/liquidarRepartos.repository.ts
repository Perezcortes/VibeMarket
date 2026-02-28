import { prisma } from "@/lib/prisma";

/**
 * US0016-C: Liquidación de turno de reparto
 * "Como repartidor, quiero liquidar pedidos entregados para cerrar mi turno."
 */

export class LiquidarRepartosRepository {
  /**
   * Obtener los pedidos asignados a un repartidor que aún están en estado 'enviado'
   */
  static async getOrdersToLiquidate(courierId: string) {
    return await prisma.order.findMany({
      where: {
        courier_id: courierId,
        status: "enviado",
      },
      include: {
        address: true, // Incluimos la dirección para que el repartidor sepa a dónde fue
      },
    });
  }

  /**
   * Cambia el estado de un pedido a 'entregado' (Liquidar el pedido)
   */
  static async markOrderAsDelivered(orderId: string) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status: "entregado" },
    });
  }
}