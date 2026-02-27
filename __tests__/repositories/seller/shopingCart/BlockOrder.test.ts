import { StockGuardRepository } from '@/repositories/seller/shopingCart/BlockOrder.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar la transacción [cite: 2026-02-07]
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn((callback) => callback(prisma)),
    product: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('StockGuardRepository (HU017)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos la memoria de los mocks antes de cada ejecución [cite: 2026-02-07]
  });

  it('debe reducir el stock correctamente cuando hay disponibilidad suficiente', async () => {
    const input = {
      userId: 'user-1',
      addressId: 'addr-1',
      cartItems: [{ productId: 'prod-1', quantity: 2, price: 50 }]
    };

    // Simulamos que el producto existe y tiene stock suficiente [cite: 2026-02-07]
    (prisma.product.findUnique as jest.Mock).mockResolvedValue({
      id: 'prod-1',
      stock: 10,
      name: 'Camiseta Vibe'
    });

    await StockGuardRepository.secureCheckout(input);

    // Verificamos que se llame a la transacción y se descuente el stock [cite: 2026-02-07]
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: 'prod-1' },
      data: {
        stock: { decrement: 2 }
      }
    });
  });

  it('debe lanzar un error y abortar la transacción si no hay stock suficiente', async () => {
    const input = {
      userId: 'user-1',
      addressId: 'addr-1',
      cartItems: [{ productId: 'prod-1', quantity: 10, price: 50 }]
    };

    // Simulamos que solo hay 5 unidades disponibles [cite: 2026-02-07]
    (prisma.product.findUnique as jest.Mock).mockResolvedValue({
      id: 'prod-1',
      stock: 5,
      name: 'Camiseta Vibe'
    });

    // Validamos que la promesa se rechace con el mensaje de error esperado [cite: 2026-02-07]
    await expect(StockGuardRepository.secureCheckout(input))
      .rejects.toThrow('Stock insuficiente para el producto: Camiseta Vibe');

    // Al lanzar error, el update nunca debe ejecutarse [cite: 2026-02-07]
    expect(prisma.product.update).not.toHaveBeenCalled();
  });
});