import { CartAddProductRepository } from '@/repositories/seller/shopingCart/AddProduct.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar las operaciones del carrito [cite: 2026-02-07]
jest.mock('@/lib/prisma', () => ({
  prisma: {
    cart: {
      upsert: jest.fn(),
    },
    cartItem: {
      upsert: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
}));

describe('CartAddProductRepository (HU013)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test [cite: 2026-02-07]
  });

  describe('execute', () => {
    it('debe crear un carrito si no existe y añadir el producto con la cantidad especificada', async () => {
      const input = { userId: 'user-123', productId: 'prod-456', quantity: 2 };
      const mockCart = { id: 'cart-uuid-001', user_id: 'user-123' };
      const mockCartItem = { id: 'item-uuid', ...input, cart_id: mockCart.id };

      // Simulamos la creación/recuperación del carrito
      (prisma.cart.upsert as jest.Mock).mockResolvedValue(mockCart);
      // Simulamos la inserción/actualización del item
      (prisma.cartItem.upsert as jest.Mock).mockResolvedValue(mockCartItem);

      const result = await CartAddProductRepository.execute(input);

      // Verificamos que se intente asegurar la existencia del carrito para el usuario [cite: 2026-02-06]
      expect(prisma.cart.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: input.userId }
        })
      );

      // Verificamos que se use la clave compuesta cart_id_product_id para el upsert del item [cite: 2026-02-06]
      expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
        where: {
          cart_id_product_id: {
            cart_id: mockCart.id,
            product_id: input.productId,
          },
        },
        update: {
          quantity: { increment: input.quantity },
        },
        create: {
          cart_id: mockCart.id,
          product_id: input.productId,
          quantity: input.quantity,
        },
      });

      expect(result).toEqual(mockCartItem);
    });
  });

  describe('checkStock', () => {
    it('debe obtener el stock actual y el nombre del producto para validación', async () => {
      const productId = 'prod-456';
      const mockProduct = { stock: 15, name: 'Camiseta Vibe' };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await CartAddProductRepository.checkStock(productId);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        select: { stock: true, name: true }
      });
      expect(result).toEqual(mockProduct);
    });
  });
});