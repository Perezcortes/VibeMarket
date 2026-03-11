/**
 *TEST 
 * Historia de Usuario: US012-G
 */

import { ValidaCuponService } from "@/services/buyer/cupon/validaCupon.service";
import { ValidaCuponRepository } from "@/repositories/buyer/cupon/validaCupon.repository";

//ejecucion npx jest __tests__/services/buyer/cupon/validaCupón.service.test.ts

// Mock del repositorio para controlar las respuestas en los tests
jest.mock("@/repositories/buyer/cupon/validaCupon.repository");

describe("Guía de validación de cupón - US012-G", () => {
  let validaCuponService: ValidaCuponService;

  beforeEach(() => {
    validaCuponService = new ValidaCuponService();
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  it("debería validar un cupón activo correctamente", async () => {
    (ValidaCuponRepository.getCouponState as jest.Mock).mockResolvedValue("activo");

    const response = await validaCuponService.validateCoupon("coupon123");
    expect(response).toEqual({
      success: true,
      message: "El estado del cupón es: activo.",
      data: "activo"
    });
  });

  it("debería validar un cupón expirado correctamente", async () => {
    (ValidaCuponRepository.getCouponState as jest.Mock).mockResolvedValue("expirado");

    const response = await validaCuponService.validateCoupon("coupon123");
    expect(response).toEqual({
      success: true,
      message: "El estado del cupón es: expirado.",
      data: "expirado"
    });
  });

  it("debería validar un cupón inexistente correctamente", async () => {
    (ValidaCuponRepository.getCouponState as jest.Mock).mockResolvedValue("inexistente");

    const response = await validaCuponService.validateCoupon("coupon123");
    expect(response).toEqual({
      success: true,
      message: "El estado del cupón es: inexistente.",
      data: "inexistente"
    });
  });

  it("debería manejar errores al validar un cupón", async () => {
    (ValidaCuponRepository.getCouponState as jest.Mock).mockRejectedValue(new Error("Error de base de datos"));

    const response = await validaCuponService.validateCoupon("coupon123");
    expect(response).toEqual({
      success: false,
      message: "Ocurrió un error al validar el cupón.",
      error: "Error de base de datos"
    });
  });

  it("debería lanzar un error si no se proporciona un ID de cupón válido", async () => {
    await expect(validaCuponService.validateCoupon("")).rejects.toThrow("Se requiere un ID de cupón válido para validar.");
  });
}); 