import { prisma } from "@/lib/prisma";

/**
 * US003-A: Monitoreo de pedidos recibidos.
 * "Como vendedor, quiero ver pedidos recibidos, para estar al pendiente."
 */
export const OrderMonitoringRepository = {
  /**
   * Obtiene los pedidos donde el vendedor tiene participación,
   * filtrando los items para mostrar solo lo que le pertenece.
   */
  async findReceivedOrders(sellerId: string) {
    return prisma.order.findMany({
      // 1. FILTRO DE PEDIDOS:
      // Selecciona solo las órdenes que contienen al menos un producto del vendedor.
      where: {
        items: {
          some: {
            product: {
              seller_id: sellerId
            }
          }
        }
      },

      // 2. INCLUSIÓN DE DATOS (JOINS):
      include: {
        // FILTRO DE PRIVACIDAD (Línea clave):
        // Solo incluimos los items que pertenecen a este vendedor específico.
        items: {
          where: {
            product: {
              seller_id: sellerId
            }
          },
          include: {
            product: true
          }
        },

        // Datos del comprador (solo campos necesarios)
        buyer: {
          select: {
            full_name: true,
            email: true
          }
        },

        // Dirección completa de envío
        address: true
      },

      // 3. ORDENAMIENTO:
      // Lo más nuevo aparece al principio de la lista.
      orderBy: {
        id: "desc"
      }
    });
  }
};


