import { ProductCategoryFilterRepository } from '@/repositories/seller/search/FiltrerByCategory.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar las consultas
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
  },
}));

describe('ProductCategoryFilterRepository (HU010)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada ejecución
  });

  describe('execute', () => {
    it('debe listar productos filtrados por el slug de su categoría', async () => {
      const slug = 'tecnologia';
      const mockProducts = [
        { 
          id: 'p1', 
          name: 'Teclado Mecánico', 
          category: { name: 'Tecnología' },
          images: [{ url: 'kb.jpg' }] 
        }
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await ProductCategoryFilterRepository.execute(slug);

      // Verificamos que el filtro se aplique correctamente a través de la relación
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            is_active: true,
            category: { slug: slug }
          }
        })
      );
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getAllCategories', () => {
    it('debe obtener todas las categorías con el conteo de productos para el menú', async () => {
      const mockCategories = [
        { id: 'c1', name: 'Hogar', slug: 'hogar', _count: { products: 5 } }
      ];

      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await ProductCategoryFilterRepository.getAllCategories();

      // Verificamos que se solicite el conteo de productos de forma ascendente
      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            _count: { select: { products: true } }
          }),
          orderBy: { name: "asc" }
        })
      );
      expect(result).toEqual(mockCategories);
    });
  });
});