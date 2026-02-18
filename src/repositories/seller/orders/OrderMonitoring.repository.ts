import { prisma } from "@/lib/prisma";

/**
 * US003-A: Monitoreo de pedidos recibidos.
 * "Como vendedor, quiero ver pedidos recibidos, para estar al pendiente."
 */
export const OrderMonitoringRepository = {
  // Obtiene los pedidos donde el vendedor tenga al menos un producto vendido
  async findReceivedOrders(sellerId: string) {
    return prisma.order.findMany({
      // Filtra pedidos que tengan items
      // cuyo producto pertenezca al vendedor
      where: {
        items: {
          some: {
            product: {
              seller_id: sellerId
            }
          }
        }
      },

      // Incluye información relacionada al pedido
      include: {
        // Items del pedido + producto
        items: {
          include: {
            product: true
          }
        },

        // Información  del comprador
        buyer: {
          select: {
            full_name: true,
            email: true
          }
        },

        // Dirección de envío
        address: true
      },

      // Ordena del pedido más reciente al más antiguo
      orderBy: {
        id: "desc"
      }
    });
  }
};