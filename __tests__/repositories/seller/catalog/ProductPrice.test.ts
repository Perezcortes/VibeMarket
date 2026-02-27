import { ProductPriceRepository } from '@/repositories/seller/catalog/ProductPrice.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
  },
}));

describe('ProductPriceRepository (HU007)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada ejecución
  });

  it('debe obtener la información de precio y stock de un producto activo', async () => {
    const productId = 'prod-uuid-789';
    
    // Simulación de los datos financieros del producto
    const mockPriceData = {
      id: productId,
      name: 'Audífonos Bluetooth Pro',
      price: 89.99,
      stock: 120,
      is_active: true,
      category: {
        name: 'Electrónica'
      }
    };

    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockPriceData);

    const result = await ProductPriceRepository.execute(productId);

    // Verificamos que se llame con el ID correcto y el filtro de seguridad
    expect(prisma.product.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: productId,
          is_active: true
        }
      })
    );

    // Comprobamos la precisión del precio
    expect(result).toEqual(mockPriceData);
    expect(result?.price).toBe(89.99);
    expect(result?.stock).toBeGreaterThan(0);
  });

  it('debe devolver null si el producto está inactivo (seguridad de precio)', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await ProductPriceRepository.execute('prod-inactivo');

    expect(result).toBeNull();
  });
});