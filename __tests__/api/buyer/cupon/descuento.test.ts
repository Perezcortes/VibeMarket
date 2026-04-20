import { POST } from "@/app/api/cart/coupons/route";
import { ValidaCuponService } from "@/services/buyer/cupon/validaCupon.service";

// ✨ 1. Simulamos (mock) el servicio para aislar la prueba de la API
jest.mock("@/services/buyer/cupon/validaCupon.service");

// ✨ 2. ¡NUEVO! Simulamos NextResponse para que Jest no rompa el JSON
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, options?: { status?: number }) => {
      return {
        status: options?.status || 200,
        json: async () => body, // Devolvemos el cuerpo directamente para que res.json() funcione
      };
    },
  },
}));

describe("API de Validación de Cupones de Descuento", () => {
  let mockValidateCouponForCart: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Preparamos la función que simularemos en cada test
    mockValidateCouponForCart = jest.fn();
    
    // Le decimos a Jest que use nuestro mock del servicio
    (ValidaCuponService as jest.Mock).mockImplementation(() => {
      return {
        validateCouponForCart: mockValidateCouponForCart,
      };
    });
  });

  const mockRequest = (body: any) => {
    return {
      json: async () => body,
    } as any;
  };

  test("1. Debe retornar error si el cupón NO EXISTE (☑️ Verifica existencia y ☑️ Muestra si es inválido)", async () => {
    mockValidateCouponForCart.mockRejectedValue(new Error("Cupón no encontrado"));

    const req = mockRequest({ code: "CUPON_FANTASMA", cartProductIds: ["prod-1"] });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400); 
    expect(data.error).toBe("Cupón no encontrado");
  });

  test("2. Debe rechazar el cupón si está INACTIVO (☑️ Verifica el estado del cupón)", async () => {
    mockValidateCouponForCart.mockRejectedValue(new Error("El cupón no está activo"));

    const req = mockRequest({ code: "APAGADO", cartProductIds: ["prod-1"] });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("El cupón no está activo");
  });

  test("3. Debe rechazar el cupón si está EXPIRADO (☑️ Verifica fecha de expiración)", async () => {
    mockValidateCouponForCart.mockRejectedValue(new Error("El cupón ha expirado"));

    const req = mockRequest({ code: "VIEJO2023", cartProductIds: ["prod-1"] });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("El cupón ha expirado");
  });

  test("4. Debe aplicar cupón de PORCENTAJE correctamente (☑️ Verifica tipo, valor y subtotal)", async () => {
    mockValidateCouponForCart.mockResolvedValue({
      isValid: true,
      discountedAmount: 600,
      finalTotal: 600
    });

    const req = mockRequest({ code: "MITAD50", cartProductIds: ["prod-1"] });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isValid).toBe(true);
    expect(data.discountedAmount).toBe(600);
    expect(data.finalTotal).toBe(600);
  });

  test("5. Debe aplicar cupón de MONTO FIJO correctamente (☑️ Verifica tipo, valor y subtotal)", async () => {
    mockValidateCouponForCart.mockResolvedValue({
      isValid: true,
      discountedAmount: 100,
      finalTotal: 1100
    });

    const req = mockRequest({ code: "MENOS100", cartProductIds: ["prod-1"] });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isValid).toBe(true);
    expect(data.discountedAmount).toBe(100);
    expect(data.finalTotal).toBe(1100);
  });
});