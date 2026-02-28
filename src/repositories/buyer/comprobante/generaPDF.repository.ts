import { prisma } from "@/lib/prisma";

export class ReceiptRepository {
  /**
   * Obtiene la información completa de una compra (con sus items) 
   * para poder generar el comprobante en PDF.
   */
  static async getOrderDetailsForReceipt(orderId: string) {
    // Usamos findUnique porque buscamos UN solo pedido específico
    return await prisma.order.findUnique({
      where: { 
        id: orderId 
      },
      // ¡Aquí está la magia! Le decimos a Prisma que nos traiga las tablas relacionadas
      include: {
        items: true,    // Trae todos los productos, cantidades y precios de la tabla order_items
        payments: true, // Trae la información del pago
        buyer: {        // De paso, traemos el nombre y correo del comprador
          select: {
            full_name: true,
            email: true,
          }
        }
      },
    });
  }
}