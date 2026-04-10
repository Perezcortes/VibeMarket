import { prisma } from "@/lib/prisma";

/**
 * US005-B: Ranking de ventas por categorías.
 * "Como dueño, quiero ver el reporte por categoría ordenado de mayor a menor venta..."
 */
export const CategoryRankingRepository = {
  /**
   * Obtiene todos los items vendidos (OrderItems) junto con su categoría
   * para poder procesar el ranking de las más vendidas.
   */
  async getSoldItemsWithCategories() {
    return prisma.orderItem.findMany({
      // Incluimos las tablas relacionadas necesarias
      include: {
        product: {
          select: {
            name: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }
};