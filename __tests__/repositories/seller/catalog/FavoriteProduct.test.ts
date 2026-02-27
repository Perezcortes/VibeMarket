import { FavoriteRepository } from '@/repositories/seller/catalog/FavoriteProduct.repository';
import { prisma } from '@/lib/prisma'; // <--- ESTA ES LA LÍNEA QUE FALTABA

// 1. Mockeamos el cliente de Prisma [cite: 2026-02-07]
jest.mock('@/lib/prisma', () => ({
  prisma: {
    favorite: {
      findMany: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('FavoriteRepository (HU005)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada ejecución [cite: 2026-02-07]
  });

  it('debe obtener la lista de favoritos con datos de monitoreo (precio y stock)', async () => {
    const userId = 'user-123';
    const mockFavorites = [
      {
        id: 'fav-1',
        product: {
          id: 'prod-1',
          name: 'Producto Favorito',
          price: 100,
          stock: 10,
          is_active: true,
          slug: 'prod-1',
          images: [{ url: 'img.jpg' }]
        }
      }
    ];

    // Ahora prisma ya está definido y podemos asignarle el valor [cite: 2026-02-07]
    (prisma.favorite.findMany as jest.Mock).mockResolvedValue(mockFavorites);

    const result = await FavoriteRepository.getFavoritesByUser(userId);

    // Verificamos que se llame con el select exacto que usa tu repositorio [cite: 2026-02-07]
    expect(prisma.favorite.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { user_id: userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              slug: true,
              is_active: true,
              images: {
                take: 1,
                select: { url: true }
              }
            }
          }
        },
        orderBy: { created_at: "desc" }
      })
    );

    expect(result).toEqual(mockFavorites);
  });
});