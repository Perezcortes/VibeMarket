/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Reseñas y Calificaciones
 * Historia de Usuario: HU006 - Calificar productos para ayudar a otros
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { ProductReviewRepository } from "@/repositories/seller/catalog/ProductRating.repsoitory";

// ─── DTO de entrada ────────────────────────────────────────────────────────
export interface CreateReviewDTO {
  userId: string;
  productId: string;
  rating: number;   // Escala del 1 al 5
  comment?: string;
}

// ─── DTO de salida ─────────────────────────────────────────────────────────
export interface RatingStatsDTO {
  average: number;
  totalReviews: number;
  starsDisplay: string; // Ejemplo: "4.5 / 5"
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class ProductReviewService {
  constructor(
    private readonly repository: typeof ProductReviewRepository
  ) {}

  /**
   * HU006 — Crea o actualiza la reseña de un usuario.
   * Aplica validaciones de rango y contenido.
   * * @param data - Datos de la reseña
   */
  async submitReview(data: CreateReviewDTO) {
    // ── Validaciones de Identidad ──────────────────────────────────────────
    if (!data.userId || !data.productId) {
      throw new Error("El ID de usuario y de producto son obligatorios.");
    }

    // ── Validaciones de Regla de Negocio (Rating) ──────────────────────────
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("La calificación debe estar entre 1 y 5 estrellas.");
    }

    if (!Number.isInteger(data.rating)) {
      throw new Error("La calificación debe ser un número entero.");
    }

    // ── Validación de Comentario (Opcional pero con límite) ────────────────
    if (data.comment && data.comment.length > 500) {
      throw new Error("El comentario no puede exceder los 500 caracteres.");
    }

    return this.repository.execute({
      user_id: data.userId,
      product_id: data.productId,
      rating: data.rating,
      comment: data.comment?.trim(),
    });
  }

  /**
   * HU006 — Obtiene estadísticas de calificación formateadas.
   * * @param productId - ID del producto
   */
  async getProductStats(productId: string): Promise<RatingStatsDTO> {
    const stats = await this.repository.getProductRatingStats(productId);

    // Redondeamos el promedio a un decimal (ej: 4.567 -> 4.6)
    const formattedAverage = Math.round(stats.average * 10) / 10;

    return {
      average: formattedAverage,
      totalReviews: stats.totalReviews,
      starsDisplay: `${formattedAverage} / 5`
    };
  }
}