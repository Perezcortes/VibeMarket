import { prisma } from "@/lib/prisma";

/**
 * HU009: Búsqueda de productos por nombre
 * Criterio de aceptación: El comprador puede ingresar un término de búsqueda 
 * y obtener una lista de productos cuyos nombres coincidan con dicho término.
 */
export const ProductSearchRepository = {

  /**
   * Busca productos activos que contengan la cadena de texto proporcionada en su nombre.
   * Incluye la categoría y la primera imagen para mostrar en los resultados de búsqueda.
   */
  async execute(query: string) {
    return prisma.product.findMany({
      where: {
        is_active: true,
        // Búsqueda por nombre (insensible a mayúsculas/minúsculas en la mayoría de DBs)
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        category: {
          select: {
            name: true,
          }
        },
        images: {
          take: 1,
          select: {
            url: true,
          }
        }
      },
      take: 10, // Limitamos a los 10 resultados más relevantes para sugerencias rápidas
      orderBy: {
        _relevance: {
          fields: ['name'],
          search: query,
          sort: 'desc'
        }
      }
    });
  }

};