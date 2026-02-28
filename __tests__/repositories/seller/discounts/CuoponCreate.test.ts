import { CouponCreateRepository } from '@/repositories/seller/discounts/CuoponCreate.repository';
import { prisma } from '@/lib/prisma';
import { DiscountType } from '@prisma/client';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    coupon: { create: jest.fn() },
  },
}));

describe('CouponCreateRepository (US004-A): Vigencia y Estado)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe asignar correctamente la fecha de expiración y nacer como activo', async () => {
    const inputData = {
      seller_id: 'vendedor-123',
      code: 'VERANO',
      type: DiscountType.porcentaje, 
      value: 10.00,                 
      expires_at: new Date('2026-12-31T23:59:59Z'), 
    };

    (prisma.coupon.create as jest.Mock).mockResolvedValue({ id: 'uuid-2', ...inputData });

    await CouponCreateRepository.execute(inputData);

    // Solo validamos lo que le importa a la US004-B
    expect(prisma.coupon.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        expires_at: inputData.expires_at, 
        is_active: true,                  
      })
    }));
  });
});