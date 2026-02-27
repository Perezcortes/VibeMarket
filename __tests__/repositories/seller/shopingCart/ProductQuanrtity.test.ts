import { CartQuantityRepository } from '@/repositories/seller/shopingCart/ProductQuanrtity.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar validaciones y actualizaciones [cite: 2026-02-07]
jest.mock('@/lib/prisma', () => ({
  prisma: {
    cartItem: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('CartQuantityRepository (HU014)', () => {
  // Definimos cartItemId aquí para que sea accesible en todos los bloques 'it' [cite: 2026-02-07]
  const cartItemId = 'item-123';

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada ejecución [cite: 2026-02-07]
  });

  describe('updateQuantity', () => {
    it('debe actualizar la cantidad correctamente si hay stock suficiente', async () => {
      // Simulamos que el item existe y el producto tiene 10 unidades en stock [cite: 2026-02-06]
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({
        id: cartItemId,
        product: { stock: 10 }
      });

      const mockUpdatedItem = { id: cartItemId, quantity: 5 };
      (prisma.cartItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await CartQuantityRepository.updateQuantity({ 
        cartItemId, 
        newQuantity: 5 
      });

      // Verificamos que la persistencia reciba la cantidad exacta [cite: 2026-02-07]
      expect(prisma.cartItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: cartItemId },
          data: { quantity: 5 }
        })
      );
      expect(result.quantity).toBe(5);
    });

    it('debe limitar la cantidad al stock máximo disponible si el usuario pide de más', async () => {
      // Simulamos que solo hay 3 unidades en stock [cite: 2026-02-06, 2026-02-07]
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({
        id: cartItemId,
        product: { stock: 3 }
      });

      const mockUpdatedItem = { id: cartItemId, quantity: 3 };
      (prisma.cartItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);

      await CartQuantityRepository.updateQuantity({ 
        cartItemId, 
        newQuantity: 10 // El usuario intenta pedir 10
      });

      // Verificamos que la persistencia se trunque al stock disponible (3) [cite: 2026-02-07]
      expect(prisma.cartItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { quantity: 3 }
        })
      );
    });

    it('debe lanzar un error si el artículo no existe en el carrito', async () => {
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        CartQuantityRepository.updateQuantity({ cartItemId: 'id-falso', newQuantity: 1 })
      ).rejects.toThrow("El artículo no existe en el carrito");
    });
  });

  describe('removeItem', () => {
    it('debe eliminar el ítem del carrito permanentemente', async () => {
      // El error de cartItemId desaparece porque está definido al inicio del describe [cite: 2026-02-07]
      await CartQuantityRepository.removeItem(cartItemId);

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: cartItemId }
      });
    });
  });
});