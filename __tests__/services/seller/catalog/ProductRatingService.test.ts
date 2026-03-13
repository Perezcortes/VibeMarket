/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Reseñas y Calificaciones (Pruebas Unitarias)
 * Historia de Usuario: HU006 - Calificar productos para ayudar a otros
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { ProductReviewService } from "@/services/seller/catalog/ProductRating.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
  getProductRatingStats: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const USER_ID = "user-rev-001";
const PRODUCT_ID = "prod-rev-001";

const mockReviewData = {
  userId: USER_ID,
  productId: PRODUCT_ID,
  rating: 5,
  comment: "Excelente producto, superó mis expectativas. ",
};

const mockStatsFromDB = {
  average: 4.5678,
  totalReviews: 12,
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("ProductReviewService — HU006", () => {
  let service: ProductReviewService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductReviewService(mockRepository as any);
  });

  // ── submitReview ─────────────────────────────────────────────────────────
  describe("submitReview()", () => {
    it("debería crear o actualizar una reseña exitosamente", async () => {
      mockRepository.execute.mockResolvedValue({ id: "rev-123", ...mockReviewData });

      const result = await service.submitReview(mockReviewData);

      expect(mockRepository.execute).toHaveBeenCalledWith({
        user_id: USER_ID,
        product_id: PRODUCT_ID,
        rating: 5,
        comment: "Excelente producto, superó mis expectativas.", // Validamos el trim()
      });
      expect(result.id).toBe("rev-123");
    });

    it("debería lanzar error si faltan IDs de usuario o producto", async () => {
      await expect(service.submitReview({ ...mockReviewData, userId: "" }))
        .rejects.toThrow("El ID de usuario y de producto son obligatorios.");
    });

    it("debería lanzar error si el rating es menor a 1 o mayor a 5", async () => {
      await expect(service.submitReview({ ...mockReviewData, rating: 0 }))
        .rejects.toThrow("La calificación debe estar entre 1 y 5 estrellas.");

      await expect(service.submitReview({ ...mockReviewData, rating: 6 }))
        .rejects.toThrow("La calificación debe estar entre 1 y 5 estrellas.");
    });

    it("debería lanzar error si el rating no es un número entero", async () => {
      await expect(service.submitReview({ ...mockReviewData, rating: 4.5 }))
        .rejects.toThrow("La calificación debe ser un número entero.");
    });

    it("debería lanzar error si el comentario excede los 500 caracteres", async () => {
      const longComment = "a".repeat(501);
      await expect(service.submitReview({ ...mockReviewData, comment: longComment }))
        .rejects.toThrow("El comentario no puede exceder los 500 caracteres.");
    });

    it("debería permitir enviar una reseña sin comentario", async () => {
      const noCommentData = { userId: USER_ID, productId: PRODUCT_ID, rating: 4 };
      mockRepository.execute.mockResolvedValue({ id: "rev-456", ...noCommentData });

      await service.submitReview(noCommentData);

      expect(mockRepository.execute).toHaveBeenCalledWith({
        user_id: USER_ID,
        product_id: PRODUCT_ID,
        rating: 4,
        comment: undefined,
      });
    });
  });

  // ── getProductStats ──────────────────────────────────────────────────────
  describe("getProductStats()", () => {
    it("debería retornar estadísticas formateadas con redondeo a un decimal", async () => {
      mockRepository.getProductRatingStats.mockResolvedValue(mockStatsFromDB);

      const result = await service.getProductStats(PRODUCT_ID);

      expect(mockRepository.getProductRatingStats).toHaveBeenCalledWith(PRODUCT_ID);
      expect(result.average).toBe(4.6); // Redondeo de 4.5678
      expect(result.starsDisplay).toBe("4.6 / 5");
      expect(result.totalReviews).toBe(12);
    });

    it("debería manejar casos donde no hay reseñas (promedio 0)", async () => {
      mockRepository.getProductRatingStats.mockResolvedValue({
        average: 0,
        totalReviews: 0,
      });

      const result = await service.getProductStats(PRODUCT_ID);

      expect(result.average).toBe(0);
      expect(result.starsDisplay).toBe("0 / 5");
      expect(result.totalReviews).toBe(0);
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.getProductRatingStats.mockRejectedValue(new Error("DB Error"));

      await expect(service.getProductStats(PRODUCT_ID)).rejects.toThrow("DB Error");
    });
  });
});