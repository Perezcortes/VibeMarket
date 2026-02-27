import { CouponCreateRepository } from '@/repositories/seller/discounts/CuoponCreate.repository';
import { prisma } from '@/lib/prisma';
import { DiscountType } from '@prisma/client';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    coupon: { create: jest.fn() },
  },
}));

describe('CouponCreateRepository (US004-B: Reglas de Descuento)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un cupón con sus reglas de descuento básicas y código en mayúsculas', async () => {
    const inputData = {
      seller_id: 'vendedor-123',
      code: 'navidad2026', 
      type: DiscountType.monto_fijo, 
      value: 150.00,
      expires_at: new Date('2026-12-31T23:59:59Z'), 
    };

    (prisma.coupon.create as jest.Mock).mockResolvedValue({ id: 'uuid-1', ...inputData });

    await CouponCreateRepository.execute(inputData);

    // Validación estricta para US004-B
    expect(prisma.coupon.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        seller_id: inputData.seller_id,
        code: 'NAVIDAD2026', 
        type: inputData.type,
        value: inputData.value,
      })
    }));
  });
});