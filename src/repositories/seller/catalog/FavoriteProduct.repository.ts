import { prisma } from "@/lib/prisma";

/**
 * HU005: Gestión de Productos Favoritos
 * Criterio de aceptación: El comprador puede marcar productos como favoritos 
 * y ver su lista personalizada para monitorearlos.
 */
export const FavoriteRepository = {

  /**
   * Agrega un producto a la lista de favoritos del usuario.
   * Si ya existe, lo ignora gracias al @@unique del esquema.
   */
  async toggleFavorite(data: { user_id: string; product_id: string }) {
    // Buscamos si ya existe el favorito para hacer un "toggle" (quitar/poner)
    const existing = await prisma.favorite.findUnique({
      where: {
        user_id_product_id: {
          user_id: data.user_id,
          product_id: data.product_id,
        },
      },
    });

    if (existing) {
      return prisma.favorite.delete({
        where: { id: existing.id },
      });
    }

    return prisma.favorite.create({
      data: {
        user_id: data.user_id,
        product_id: data.product_id,
      },
    });
  },

  /**
   * Obtiene la lista de productos favoritos de un comprador específico.
   * Incluye datos clave para el monitoreo (precio y stock).
   */
  async getFavoritesByUser(user_id: string) {
    return prisma.favorite.findMany({
      where: { user_id: user_id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true, // Para monitorear cambios de precio
            stock: true, // Para monitorear disponibilidad
            is_active: true,
            images: {
              take: 1,
              select: { url: true }
            }
          }
        }
      },
      orderBy: {
        created_at: "desc"
      }
    });
  }
};