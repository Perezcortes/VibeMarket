import { ProductReviewRepository } from '@/repositories/seller/catalog/ProductRating.repsoitory';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    review: {
      upsert: jest.fn(),
      aggregate: jest.fn(),
    },
  },
}));

describe('ProductReviewRepository (HU006)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Fijamos la fecha para las pruebas de actualización
    jest.useFakeTimers().setSystemTime(new Date('2026-02-27T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('execute', () => {
    it('debe crear o actualizar una reseña con puntuación y comentario', async () => {
      const inputData = {
        user_id: 'user-123',
        product_id: 'prod-456',
        rating: 5,
        comment: 'Excelente calidad, lo recomiendo.'
      };

      const mockResponse = { id: 'review-uuid', ...inputData, created_at: new Date() };
      (prisma.review.upsert as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProductReviewRepository.execute(inputData);

      // Verificamos que se use la clave única compuesta definida en el esquema
      expect(prisma.review.upsert).toHaveBeenCalledWith({
        where: {
          product_id_user_id: {
            product_id: inputData.product_id,
            user_id: inputData.user_id,
          },
        },
        update: expect.objectContaining({
          rating: inputData.rating,
          comment: inputData.comment,
        }),
        create: inputData,
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProductRatingStats', () => {
    it('debe calcular el promedio y el total de reseñas de un producto', async () => {
      const productId = 'prod-456';
      
      // Simulación de respuesta de agregación de Prisma
      const mockAggregate = {
        _avg: { rating: 4.5 },
        _count: { rating: 10 }
      };

      (prisma.review.aggregate as jest.Mock).mockResolvedValue(mockAggregate);

      const result = await ProductReviewRepository.getProductRatingStats(productId);

      expect(prisma.review.aggregate).toHaveBeenCalledWith({
        where: { product_id: productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      expect(result).toEqual({
        average: 4.5,
        totalReviews: 10,
      });
    });

    it('debe devolver promedio 0 si el producto no tiene reseñas aún', async () => {
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _avg: { rating: null },
        _count: { rating: 0 }
      });

      const result = await ProductReviewRepository.getProductRatingStats('nuevo-prod');

      expect(result.average).toBe(0);
      expect(result.totalReviews).toBe(0);
    });
  });
});