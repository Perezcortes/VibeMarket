import { CartPersistenceRepository } from '@/repositories/seller/shopingCart/SaveCart.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar la recuperación y actualización del carrito [cite: 2026-02-07]
jest.mock('@/lib/prisma', () => ({
  prisma: {
    cart: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('CartPersistenceRepository (HU016)', () => {
  const userId = 'user-uuid-persistencia';
  const cartId = 'cart-uuid-123';

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test [cite: 2026-02-07]
    jest.useFakeTimers().setSystemTime(new Date('2026-02-27T10:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getSavedCart', () => {
    it('debe recuperar el carrito del usuario con los datos actualizados de los productos y sus imágenes', async () => {
      // Simulación del carrito persistente en la base de datos MariaDB [cite: 2026-02-07]
      const mockSavedCart = {
        id: cartId,
        user_id: userId,
        items: [
          {
            id: 'item-1',
            product: {
              id: 'prod-1',
              name: 'Sudadera Vibe',
              price: 45.00,
              stock: 20,
              is_active: true,
              images: [{ url: 'sudadera.jpg' }]
            }
          }
        ]
      };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockSavedCart);

      const result = await CartPersistenceRepository.getSavedCart(userId);

      // Verificamos que se busque por el user_id único definido en tu esquema [cite: 2026-02-06]
      expect(prisma.cart.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: userId },
          include: expect.objectContaining({
            items: {
              include: {
                product: expect.any(Object)
              }
            }
          })
        })
      );

      expect(result).toEqual(mockSavedCart);
      expect(result?.items[0].product.name).toBe('Sudadera Vibe');
    });

    it('debe retornar null si el usuario no tiene un carrito guardado', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await CartPersistenceRepository.getSavedCart('usuario-nuevo');

      expect(result).toBeNull();
    });
  });

  describe('touchCart', () => {
    it('debe actualizar la fecha de modificación del carrito (updated_at)', async () => {
      const mockUpdatedCart = { id: cartId, updated_at: new Date() };
      (prisma.cart.update as jest.Mock).mockResolvedValue(mockUpdatedCart);

      await CartPersistenceRepository.touchCart(cartId);

      // Verificamos que la persistencia envíe una nueva fecha a MariaDB [cite: 2026-02-07]
      expect(prisma.cart.update).toHaveBeenCalledWith({
        where: { id: cartId },
        data: { updated_at: expect.any(Date) }
      });
    });
  });
});