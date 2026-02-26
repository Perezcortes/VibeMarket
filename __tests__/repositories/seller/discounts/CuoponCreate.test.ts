import { CouponCreateRepository } from '@/repositories/seller/discounts/CuoponCreate.repository'; // Verifica que el nombre del archivo sea correcto
import { prisma } from '@/lib/prisma';
import { DiscountType } from '@prisma/client';

// 1. Mockeamos TU archivo de configuración de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    coupon: {
      create: jest.fn(),
    },
  },
}));

describe('CouponCreateRepository (US004-A y US004-B)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos la memoria del mock antes de cada prueba
  });

  it('debe crear un cupón con reglas de descuento y vigencia', async () => {
    // Datos simulados que enviaría nuestro servicio
    const inputData = {
      seller_id: 'vendedor-123',
      code: 'NAVIDAD2026',
      type: DiscountType.monto_fijo, 
      value: 150.00,                 
      expires_at: new Date('2026-12-31T23:59:59Z'), 
    };

    // La respuesta ficticia que nos devolvería la BD
    const expectedCoupon = {
      id: 'cupon-uuid-1',
      ...inputData,
      is_active: true,
      created_at: new Date(),
    };

    // Le decimos a Jest que cuando llame a create, devuelva el cupón esperado
    (prisma.coupon.create as jest.Mock).mockResolvedValue(expectedCoupon);

    // Ejecutamos nuestra función real
    const result = await CouponCreateRepository.execute(inputData);

    // Comprobamos que todo funcionó como debía
    expect(prisma.coupon.create).toHaveBeenCalledTimes(1);
    expect(prisma.coupon.create).toHaveBeenCalledWith({
      data: {
        seller_id: inputData.seller_id,
        code: inputData.code.toUpperCase(), // Validamos que se pase a mayúsculas
        type: inputData.type,
        value: inputData.value,
        expires_at: inputData.expires_at,
        is_active: true, // Validamos que nazca activo
      },
    });
    
    // El resultado debe ser el mismo que nos dio la base de datos simulada
    expect(result).toEqual(expectedCoupon);
  });
});