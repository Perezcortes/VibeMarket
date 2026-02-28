import { ValidaCuponRepository } from "@/repositories/buyer/cupon/validaCupon.repository";
import { prisma } from "@/lib/prisma";

// ejecucion: npm test -- __tests__/repositories/buyer/cupon/validaCupon.test.ts

// 1. Mockeamos a Prisma (Nota que ahora usamos 'coupon' en lugar de 'cupon')
jest.mock("@/lib/prisma", () => ({
  prisma: {
    coupon: {
      findUnique: jest.fn(),
    },
  },
}));

describe("US012-G - Validación de cupón", () => {
  // 2. Actualizamos el ID: Ahora es un UUID (String), no un número
  const mockCouponId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe retornar 'activo' si el cupón está habilitado y la fecha es futura", async () => {
    // Simulamos respuesta de DB: Cupón activo y vence mañana
    const mockDbResponse = { 
      is_active: true, 
      expires_at: new Date(Date.now() + 86400000) // Fecha futura (+1 día)
    };

    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue(mockDbResponse);

    // Ejecutamos
    const result = await ValidaCuponRepository.getCouponState(mockCouponId);

    // Verificamos que llamó a prisma con los campos nuevos
    expect(prisma.coupon.findUnique).toHaveBeenCalledWith({
      where: { id: mockCouponId },
      select: { is_active: true, expires_at: true },
    });

    // Esperamos que tu lógica traduzca esto a 'activo'
    expect(result).toEqual("activo");
  });

  it("Debe retornar 'expirado' si la fecha de vencimiento ya pasó", async () => {
    // Simulamos respuesta de DB: Cupón activo pero venció ayer
    const mockDbResponse = { 
      is_active: true, 
      expires_at: new Date(Date.now() - 86400000) // Fecha pasada (-1 día)
    };

    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue(mockDbResponse);

    const result = await ValidaCuponRepository.getCouponState(mockCouponId);

    expect(result).toEqual("expirado");
  });

  it("Debe retornar 'inactivo' si el vendedor lo desactivó manualment (is_active: false)", async () => {
    // Simulamos respuesta de DB: Cupón desactivado manualmente
    const mockDbResponse = { 
      is_active: false, 
      expires_at: new Date(Date.now() + 86400000) 
    };

    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue(mockDbResponse);

    const result = await ValidaCuponRepository.getCouponState(mockCouponId);

    expect(result).toEqual("inactivo");
  });
});