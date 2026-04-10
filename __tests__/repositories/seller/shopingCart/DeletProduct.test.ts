import { CartRemoveItemRepository } from '@/repositories/seller/shopingCart/DeletProduct.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar las eliminaciones
jest.mock('@/lib/prisma', () => ({
  prisma: {
    cartItem: {
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    cart: {
      findUnique: jest.fn(),
    },
  },
}));

describe('CartRemoveItemRepository (HU015)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test para evitar colisiones [cite: 2026-02-07]
  });

  describe('execute', () => {
    it('debe eliminar un ítem específico del carrito usando su ID único', async () => {
      const cartItemId = 'item-uuid-123';
      const mockDeletedItem = { id: cartItemId, product_id: 'prod-1', quantity: 1 };

      (prisma.cartItem.delete as jest.Mock).mockResolvedValue(mockDeletedItem);

      const result = await CartRemoveItemRepository.execute(cartItemId);

      // Verificamos que se llame al método delete con el ID correcto [cite: 2026-02-07]
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: cartItemId },
      });
      expect(result).toEqual(mockDeletedItem);
    });
  });

  describe('clearCart', () => {
    it('debe eliminar todos los items asociados al carrito del usuario', async () => {
      const userId = 'user-uuid-999';
      const cartId = 'cart-uuid-001';

      // 1. Simulamos que encontramos el carrito del usuario [cite: 2026-02-07]
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: cartId });
      // 2. Simulamos la eliminación masiva de items
      (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({ count: 5 });

      const result = await CartRemoveItemRepository.clearCart(userId);

      // Verificamos que primero busque el carrito por el ID de usuario [cite: 2026-02-06]
      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { user_id: userId },
        select: { id: true }
      });

      // Verificamos que elimine los items usando el cart_id obtenido [cite: 2026-02-07]
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cart_id: cartId },
      });
      expect(result).toEqual({ count: 5 });
    });

    it('debe retornar null si el usuario no tiene un carrito activo', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await CartRemoveItemRepository.clearCart('user-sin-carrito');

      expect(result).toBeNull();
      expect(prisma.cartItem.deleteMany).not.toHaveBeenCalled();
    });
  });
});