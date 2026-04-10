import { prisma } from "@/lib/prisma";

/**
 * HU012: Ordenamiento de artículos por precio
 * Criterio de aceptación: El comprador puede cambiar el orden de la lista 
 * para ver primero los productos de mayor precio.
 */
export const ProductSortRepository = {

  /**
   * Obtiene la lista de productos ordenada según el criterio de precio.
   * @param direction 'asc' para menor a mayor, 'desc' para mayor a menor.
   */
  async execute(direction: 'asc' | 'desc' = 'desc') {
    return prisma.product.findMany({
      where: {
        is_active: true,
        stock: {
          gt: 0 // Solo mostramos lo que está disponible para la venta
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true, // Campo clave para el ordenamiento
        images: {
          take: 1,
          select: { url: true }
        },
        category: {
          select: { name: true }
        }
      },
      orderBy: {
        price: direction, // US012: Aplicación del ordenamiento
      },
    });
  }

};