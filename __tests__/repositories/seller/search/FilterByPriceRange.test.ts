import { ProductPriceFilterRepository } from '@/repositories/seller/search/FilterByPriceRange.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
  },
}));

describe('ProductPriceFilterRepository (HU011)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test [cite: 2026-02-07]
  });

  describe('execute', () => {
    it('debe filtrar productos dentro del rango de precio especificado', async () => {
      const params = { minPrice: 100, maxPrice: 500 };
      const mockProducts = [
        { id: '1', name: 'Producto A', price: 250, category: { name: 'Electrónica' }, images: [] }
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await ProductPriceFilterRepository.execute(params);

      // Verificamos que se usen los operadores gte y lte correctamente [cite: 2026-02-07]
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              gte: 100,
              lte: 500,
            },
            is_active: true
          }),
          orderBy: { price: "asc" }
        })
      );

      expect(result).toEqual(mockProducts);
    });

    it('debe usar valores por defecto si no se proporcionan límites', async () => {
      await ProductPriceFilterRepository.execute({});

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              gte: 0,
              lte: 999999,
            }
          })
        })
      );
    });
  });

  describe('getPriceRangeBounds', () => {
    it('debe obtener los valores mínimos y máximos globales de los productos activos', async () => {
      const mockAggregate = {
        _min: { price: 10.50 },
        _max: { price: 2500.00 }
      };

      (prisma.product.aggregate as jest.Mock).mockResolvedValue(mockAggregate);

      const result = await ProductPriceFilterRepository.getPriceRangeBounds();

      // Verificamos que se llame a la agregación de Prisma [cite: 2026-02-07]
      expect(prisma.product.aggregate).toHaveBeenCalledWith({
        where: { is_active: true },
        _min: { price: true },
        _max: { price: true },
      });

      expect(result).toEqual({ min: 10.50, max: 2500.00 });
    });

    it('debe devolver ceros si no hay productos disponibles', async () => {
      (prisma.product.aggregate as jest.Mock).mockResolvedValue({
        _min: { price: null },
        _max: { price: null }
      });

      const result = await ProductPriceFilterRepository.getPriceRangeBounds();
      expect(result).toEqual({ min: 0, max: 0 });
    });
  });
});