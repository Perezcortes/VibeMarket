import { CouponStatusRepository } from '@/repositories/seller/discounts/CuoponStatus.repository'; 
import { prisma } from '@/lib/prisma';

// 1. Mockeamos TU archivo de Prisma, pero esta vez la función update
jest.mock('@/lib/prisma', () => ({
  prisma: {
    coupon: {
      update: jest.fn(),
    },
  },
}));

describe('CouponStatusRepository (US004-C)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe actualizar el estado del cupón a desactivado (false)', async () => {
    const couponId = 'cupon-uuid-123';
    const isActive = false;

    // Lo que devolvería la BD después de actualizar
    const expectedUpdatedCoupon = {
      id: couponId,
      code: 'NAVIDAD2026',
      is_active: isActive, 
    };

    // Simulamos la respuesta
    (prisma.coupon.update as jest.Mock).mockResolvedValue(expectedUpdatedCoupon);

    // Ejecutamos
    const result = await CouponStatusRepository.execute(couponId, isActive);

    // Verificamos
    expect(prisma.coupon.update).toHaveBeenCalledTimes(1);
    expect(prisma.coupon.update).toHaveBeenCalledWith({
      where: { 
        id: couponId 
      },
      data: { 
        is_active: isActive 
      },
    });
    expect(result).toEqual(expectedUpdatedCoupon);
  });

  it('debe actualizar el estado del cupón a activado (true)', async () => {
    const couponId = 'cupon-uuid-123';
    const isActive = true;

    const expectedUpdatedCoupon = {
      id: couponId,
      code: 'NAVIDAD2026',
      is_active: isActive, 
    };

    (prisma.coupon.update as jest.Mock).mockResolvedValue(expectedUpdatedCoupon);

    const result = await CouponStatusRepository.execute(couponId, isActive);

    expect(result.is_active).toBe(true);
  });
});