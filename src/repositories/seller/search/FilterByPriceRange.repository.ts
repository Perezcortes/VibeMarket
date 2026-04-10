import { prisma } from "@/lib/prisma";

/**
 * HU011: Filtrado de productos por rango de precio
 * Criterio de aceptación: El comprador puede definir un presupuesto (mínimo y máximo)
 * y el sistema debe mostrar solo los productos que se encuentren en ese rango.
 */
export const ProductPriceFilterRepository = {

  /**
   * Obtiene productos cuyo precio se encuentre entre los límites establecidos.
   */
  async execute(params: { minPrice?: number; maxPrice?: number; categorySlug?: string }) {
    return prisma.product.findMany({
      where: {
        is_active: true,
        // Filtro de rango de precio
        price: {
          gte: params.minPrice ?? 0,      // Greater Than or Equal (Mayor o igual a)
          lte: params.maxPrice ?? 999999, // Less Than or Equal (Menor o igual a)
        },
        // Opcional: Combinar con categoría si el usuario ya está en una sección
        category: params.categorySlug 
          ? { slug: params.categorySlug } 
          : undefined,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          take: 1,
          select: { url: true }
        },
        category: {
          select: { name: true }
        }
      },
      orderBy: {
        price: "asc", // Por defecto, mostrar los más económicos primero
      },
    });
  },

  /**
   * Obtiene el precio mínimo y máximo real de todos los productos.
   * Útil para configurar dinámicamente los límites del "Slider" de precios en la UI.
   */
  async getPriceRangeBounds() {
    const result = await prisma.product.aggregate({
      where: { is_active: true },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      min: result._min.price || 0,
      max: result._max.price || 0,
    };
  }
};