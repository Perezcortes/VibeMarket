import { prisma } from "@/lib/prisma";


/**
 * US0016-D: Optimización de rutas diarias
 * "Como repartidor, quiero gestionar mis rutas diarias para optimizar tiempo."
 */

export class RutasOptimizadasRepository {
  /**
   * Obtiene los pedidos pendientes de un repartidor junto con los datos de la dirección
   * para poder calcular la ruta óptima.
   */
  static async getPendingOrdersWithAddress(courierId: string) {
    return await prisma.order.findMany({
      where: {
        courier_id: courierId,
        status: "enviado", // Filtramos los que tiene pendientes de entregar
      },
      include: {
        // Aquí le decimos a Prisma que traiga la tabla address conectada
        address: true, 
      },
    });
  }
}