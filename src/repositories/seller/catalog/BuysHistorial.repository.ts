import { prisma } from "@/lib/prisma";

/**
 * HU008: Historial de compras para control de gastos
 * Criterio de aceptación: El comprador puede listar todas sus órdenes pasadas,
 * viendo montos totales, fechas y el estado de sus pagos.
 */
export const PurchaseHistoryRepository = {

  /**
   * Obtiene todas las órdenes realizadas por un usuario específico.
   * Incluye detalles de productos y pagos para un control financiero completo.
   */
  async execute(userId: string) {
    return prisma.order.findMany({
      where: {
        buyer_id: userId,
      },
      select: {
        id: true,
        total_amount: true, // US008: Monto total para control de gastos
        status: true,       // pendiente, pagado, entregado, etc.
        address: {
          select: {
            city: true,
            street: true,
          }
        },
        // Detalle de los productos comprados en cada orden
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
        // Información del pago realizado
        payments: {
          select: {
            provider: true,
            status: true,
            amount: true,
            created_at: true,
          }
        },
        history: {
          orderBy: { changed_at: 'desc' },
          take: 1,
          select: {
            changed_at: true
          }
        }
      },
      orderBy: {
        id: 'desc' // Opcional: podrías añadir un campo created_at a Order para mejor ordenamiento
      }
    });
  },

  /**
   * Obtiene un resumen estadístico de gastos para el usuario.
   * Útil para mostrar un tablero (dashboard) de "Total gastado este mes".
   */
  async getExpenseSummary(userId: string) {
    return prisma.order.aggregate({
      where: {
        buyer_id: userId,
        status: 'pagado', // Solo contamos lo que ya se pagó efectivamente
      },
      _sum: {
        total_amount: true,
      },
      _count: {
        id: true,
      }
    });
  }
};