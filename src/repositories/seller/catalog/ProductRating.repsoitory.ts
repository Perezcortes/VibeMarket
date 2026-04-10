import { prisma } from "@/lib/prisma";

/**
 * HU006: Calificación de productos
 * Criterio de aceptación: El comprador puede dejar una puntuación y un comentario
 * en productos que ha adquirido para guiar a la comunidad.
 */
export const ProductReviewRepository = {

  /**
   * Crea o actualiza una reseña de un producto.
   * El @@unique([product_id, user_id]) en tu esquema asegura que 
   * un usuario solo pueda calificar el mismo producto una vez.
   */
  async execute(data: {
    user_id: string;
    product_id: string;
    rating: number;
    comment?: string;
  }) {
    return prisma.review.upsert({
      where: {
        product_id_user_id: {
          product_id: data.product_id,
          user_id: data.user_id,
        },
      },
      update: {
        rating: data.rating,
        comment: data.comment,
        created_at: new Date(), // Actualizamos la fecha si edita su opinión
      },
      create: {
        product_id: data.product_id,
        user_id: data.user_id,
        rating: data.rating,
        comment: data.comment,
      },
    });
  },

  /**
   * Obtiene el promedio de calificación y el total de reseñas de un producto.
   * Útil para mostrar las "estrellas" en la vista de catálogo.
   */
  async getProductRatingStats(product_id: string) {
    const stats = await prisma.review.aggregate({
      where: { product_id },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      average: stats._avg.rating || 0,
      totalReviews: stats._count.rating,
    };
  }
};