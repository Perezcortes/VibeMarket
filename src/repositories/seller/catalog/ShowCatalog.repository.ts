import { prisma } from "@/lib/prisma";

/**
 * HU001: Visualización de catálogo de productos
 * Criterio de aceptación: El sistema debe listar los productos activos con su información básica.
 */
export const ProductListRepository = {
  /**
   * Obtiene la lista de productos disponibles para la venta.
   * Filtra por productos activos y con stock disponible.
   */
  async execute(params?: { categorySlug?: string; limit?: number }) {
    return prisma.product.findMany({
      where: {
        is_active: true,
        stock: {
          gt: 0, // Solo productos con existencia
        },
        // Opcional: Filtrar por categoría si se provee el slug
        category: params?.categorySlug
          ? {
              slug: params.categorySlug,
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        description: true,
        stock: true,
        // Incluimos la categoría para mostrarla en la card
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        // Incluimos las imágenes para el carrusel o miniatura
        images: {
          take: 1, // Traemos solo la primera imagen para optimizar la carga de la lista
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc", // Mostrar los más nuevos primero
      },
      take: params?.limit || 20, // Limitar resultados por página
    });
  },
};