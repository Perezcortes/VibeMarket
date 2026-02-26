import { prisma } from "@/lib/prisma";

/**
 * CAPA DE PERSISTENCIA: US003-C
 * "Como vendedor, quiero ver detalle del pedido (productos, dirección, pago)"
 */
export const OrderDetailPersistenceRepository = {

  /**
   * Obtiene un pedido único con todas sus relaciones necesarias.
   * Se enfoca en las tablas: Order, OrderItem, Address, User y Payment.
   */
  async findOrderDetailById(orderId: string) {
    return prisma.order.findUnique({
      where: { 
        id: orderId 
      },
      include: {
        // 1. Productos solicitados y sus detalles (
        items: {
          include: {
            product: true // 
          }
        },
        // 2. Información de envío completa 
        address: true, // 
        // 3. Información de contacto del comprador 
        buyer: {
          select: {
            full_name: true,
            email: true,
            phone: true 
          }
        },
        // 4. Estado y detalles del pago (Línea 15 del schema)
        payments: true // 
      }
    });
  }
};