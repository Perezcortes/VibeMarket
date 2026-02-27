import { ProductListRepository } from '@/repositories/seller/catalog/ShowCatalog.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para evitar conexiones reales a MariaDB
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe('ProductListRepository (HU001)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test para evitar interferencias
  });

  it('debe listar productos activos con stock mayor a cero por defecto', async () => {
    const mockProducts = [
      {
        id: 'prod-1',
        name: 'Producto de Prueba',
        slug: 'producto-de-prueba',
        price: 100.00,
        description: 'Descripción corta',
        stock: 10,
        category: { name: 'Ropa', slug: 'ropa' },
        images: [{ url: 'image.jpg' }]
      }
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const result = await ProductListRepository.execute();

    // Verificamos los filtros de seguridad y disponibilidad
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          is_active: true,
          stock: { gt: 0 }
        }),
        take: 20 // Límite por defecto
      })
    );

    expect(result).toEqual(mockProducts);
    expect(result).toHaveLength(1);
  });

  it('debe filtrar correctamente por el slug de la categoría si se proporciona', async () => {
    const params = { categorySlug: 'electronica', limit: 5 };

    await ProductListRepository.execute(params);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { slug: 'electronica' }
        }),
        take: 5
      })
    );
  });

  it('debe solicitar solo la primera imagen para optimizar el rendimiento de la lista', async () => {
    await ProductListRepository.execute();

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          images: {
            take: 1,
            select: { url: true }
          }
        })
      })
    );
  });
});