import { ProductDetailRepository } from '@/repositories/seller/catalog/ProductDescription.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
  },
}));

describe('ProductDetailRepository (HU002)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe obtener la información detallada de un producto activo por su slug', async () => {
    const productSlug = 'iphone-15-pro-max';
    
    // Simulación del objeto completo que devuelve la BD
    const mockProductDetail = {
      id: 'uuid-prod-123',
      name: 'iPhone 15 Pro Max',
      description: 'El iPhone más potente con acabado en titanio.',
      price: 1199.99,
      stock: 50,
      updated_at: new Date(),
      images: [
        { id: 'img-1', url: 'iphone_front.jpg' },
        { id: 'img-2', url: 'iphone_side.jpg' }
      ],
      category: { id: 1, name: 'Smartphones', slug: 'smartphones' },
      seller: { full_name: 'Tienda Oficial Apple', is_active: true },
      reviews: [
        { rating: 5, comment: 'Excelente!', created_at: new Date(), user: { full_name: 'Yamil' } }
      ]
    };

    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProductDetail);

    const result = await ProductDetailRepository.execute(productSlug);

    // Verificamos que se llamó con el slug y el filtro de seguridad (is_active: true)
    expect(prisma.product.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          slug: productSlug,
          is_active: true
        }
      })
    );

    // Comprobamos que el resultado contenga los campos críticos de la HU
    expect(result).toEqual(mockProductDetail);
    expect(result?.images).toHaveLength(2);
    expect(result?.seller.full_name).toBe('Tienda Oficial Apple');
  });

  it('debe devolver null si el producto no existe o está inactivo', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await ProductDetailRepository.execute('slug-inexistente');

    expect(result).toBeNull();
  });
});