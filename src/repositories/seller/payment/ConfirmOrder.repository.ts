import { prisma } from "@/lib/prisma";

/**
 * HU019: Confirmación de orden antes del pago
 * Criterio de aceptación: El comprador debe poder revisar el resumen completo 
 * de su pedido (productos, totales, dirección y pago) antes de la transacción final.
 */
export const OrderConfirmationRepository = {

  /**
   * Obtiene el resumen detallado de una orden específica para revisión.
   */
  async getOrderSummary(orderId: string) {
    return prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        total_amount: true,
        status: true,
        // Información de envío para que el usuario confirme dónde recibirá
        address: {
          select: {
            street: true,
            city: true,
            state: true,
            postal_code: true,
            country: true,
          }
        },
        // Detalle de productos con precio unitario y cantidad
        items: {
          select: {
            quantity: true,
            unit_price: true,
            product: {
              select: {
                name: true,
                images: {
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        },
        // Método de pago seleccionado
        payments: {
          take: 1,
          orderBy: { created_at: 'desc' },
          select: {
            provider: true,
            amount: true,
            status: true,
          }
        }
      }
    });
  }
};