import { ProductDiscountRepository } from '@/repositories/seller/catalog/ProductDiscount.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
  },
}));

describe('ProductDiscountRepository (HU003)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Fijamos una fecha para las pruebas de expiración
    jest.useFakeTimers().setSystemTime(new Date('2026-02-27T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('debe obtener el producto con los cupones activos y vigentes del vendedor', async () => {
    const productSlug = 'tenis-deportivos-pro';
    
    const mockResponse = {
      id: 'prod-123',
      name: 'Tenis Deportivos Pro',
      price: 1200.00,
      seller_id: 'seller-456',
      seller: {
        full_name: 'Deportes Yamil',
        coupons: [
          {
            code: 'OFERTA20',
            type: 'porcentaje',
            value: 20,
            expires_at: new Date('2026-12-31T23:59:59Z')
          }
        ]
      }
    };

    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockResponse);

    const result = await ProductDiscountRepository.execute(productSlug);

    // Verificamos que se llame con los filtros correctos
    expect(prisma.product.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: productSlug, is_active: true },
        select: expect.objectContaining({
          seller: expect.objectContaining({
            select: expect.objectContaining({
              coupons: expect.objectContaining({
                where: expect.objectContaining({
                  is_active: true,
                  OR: [
                    { expires_at: null },
                    { expires_at: { gt: expect.any(Date) } }
                  ]
                })
              })
            })
          })
        })
      })
    );

    expect(result).toEqual(mockResponse);
    expect(result?.seller.coupons[0].code).toBe('OFERTA20');
  });

  it('debe retornar null si el producto no existe', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await ProductDiscountRepository.execute('slug-invalido');

    expect(result).toBeNull();
  });
});