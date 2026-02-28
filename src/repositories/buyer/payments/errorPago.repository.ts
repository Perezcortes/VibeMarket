import { prisma } from "@/lib/prisma";

export class PaymentStatusRepository {
  /**
   * Busca el estado del pago ('pendiente', 'aprobado', 'rechazado', 'reembolsado')
   * basándose en el ID del pedido (order_id).
   */
  static async getPaymentStatusByOrderId(orderId: string) {
    // Usamos findFirst por si hay más de un registro, que nos traiga el primero/principal
    return await prisma.payment.findFirst({
      where: { 
        order_id: orderId 
      },
      select: { 
        status: true // ¡Igual que el truco anterior! Solo traemos la columna status
      }
    });
  }
}