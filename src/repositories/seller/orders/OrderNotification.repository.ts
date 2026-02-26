import { prisma } from "@/lib/prisma";

/**
 * CAPA DE PERSISTENCIA: US003-D
 * "Como sistema, quiero notificar al comprador cuando cambie el estado"
 */
export const OrderNotificationPersistenceRepository = {

  /**
   * Obtiene los datos mínimos necesarios del comprador para enviar una notificación.
   * Accede a las tablas: Order y User (Comprador).
   */
  async getNotificationData(orderId: string) {
    return prisma.order.findUnique({
      where: { 
        id: orderId 
      },
      select: {
        id: true,         // ID del pedido para referencia en el mensaje
        status: true,     // Estado actual para informar al cliente (Línea 11 del schema)
        buyer: {          // Relación BuyerOrders (Línea 2 y 11 del schema)
          select: {
            full_name: true,
            email: true
          }
        }
      }
    });
  }
};