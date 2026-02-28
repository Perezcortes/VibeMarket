import { ProductSearchRepository } from '@/repositories/seller/search/SearchByName.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar la búsqueda
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe('ProductSearchRepository (HU009)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test [cite: 2026-02-07]
  });

  it('debe buscar productos activos cuyo nombre contenga el término de búsqueda', async () => {
    const query = 'iPhone';
    const mockResults = [
      { 
        id: 'p1', 
        name: 'iPhone 15 Pro', 
        category: { name: 'Celulares' },
        images: [{ url: 'iphone.jpg' }] 
      }
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockResults);

    const result = await ProductSearchRepository.execute(query);

    // Verificamos que se use el operador "contains" y el filtro de seguridad [cite: 2026-02-07]
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          is_active: true,
          name: {
            contains: query,
          },
        },
        take: 10, // Validación del límite para sugerencias rápidas [cite: 2026-02-07]
        orderBy: {
          _relevance: {
            fields: ['name'],
            search: query,
            sort: 'desc'
          }
        }
      })
    );

    expect(result).toEqual(mockResults);
    expect(result[0].name).toContain('iPhone');
  });

  it('debe devolver una lista vacía si no hay coincidencias', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

    const result = await ProductSearchRepository.execute('término-inexistente');

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});