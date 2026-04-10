import { prisma } from "@/lib/prisma";

/**
 * HU010: Filtrado de productos por categoría
 * Criterio de aceptación: El comprador puede seleccionar una categoría específica
 * y el sistema debe devolver únicamente los productos pertenecientes a ella.
 */
export const ProductCategoryFilterRepository = {

  /**
   * Obtiene productos filtrados por el slug de su categoría.
   * Incluye validación de productos activos y stock.
   */
  async execute(categorySlug: string) {
    return prisma.product.findMany({
      where: {
        is_active: true,
        category: {
          slug: categorySlug, // Filtramos a través de la relación
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        // Traemos el nombre de la categoría para el título de la vista
        category: {
          select: {
            name: true,
          },
        },
        images: {
          take: 1,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  /**
   * Obtiene la lista de todas las categorías disponibles para llenar el menú de filtros.
   */
  async getAllCategories() {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { products: true } // Para mostrar: "Electrónica (15)"
        }
      },
      orderBy: {
        name: "asc",
      },
    });
  }
};