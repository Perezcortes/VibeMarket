/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Reglas de Descuento de Cupones (Pruebas Unitarias)
 * Historia de Usuario: US004-B: Reglas de descuento
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari Ramirez
 * FECHA: 11 de marzo de 2026
 */
import { CouponCreateService } from "@/services/seller/discounts/CuoponCreate.service";
import { DiscountType } from "@prisma/client";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
};

const BASE_DATA = {
  seller_id: "seller-001",
  code: "PROMO50",
};

// ─── Suite US004-B ─────────────────────────────────────────────────────────
describe("CouponCreateService — US004-B: Reglas de descuento", () => {
  let service: CouponCreateService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CouponCreateService(mockRepository as any);
  });

  // ── createCoupon (validaciones de tipo y valor) ────────────────────────
  describe("createCoupon() — validaciones de tipo y valor", () => {
    it("debería crear cupón de tipo PERCENTAGE con valor válido", async () => {
      const couponData = { ...BASE_DATA, type: DiscountType.porcentaje, value: 20 };
      mockRepository.execute.mockResolvedValue({ ...couponData, is_active: true });

      const result = await service.createCoupon(couponData);

      expect(mockRepository.execute).toHaveBeenCalledWith(
        expect.objectContaining({ type: DiscountType.porcentaje, value: 20 })
      );
      expect(result.is_active).toBe(true);
    });

    it("debería crear cupón de tipo FIXED con monto válido", async () => {
      const couponData = { ...BASE_DATA, type: DiscountType.monto_fijo, value: 150 };
      mockRepository.execute.mockResolvedValue({ ...couponData, is_active: true });

      const result = await service.createCoupon(couponData);

      expect(mockRepository.execute).toHaveBeenCalledWith(
        expect.objectContaining({ type: DiscountType.monto_fijo, value: 150 })
      );
      expect(result).toBeDefined();
    });

    it("debería lanzar error si el valor del descuento es 0", async () => {
      await expect(
        service.createCoupon({ ...BASE_DATA, type: DiscountType.monto_fijo, value: 0 })
      ).rejects.toThrow("El valor del descuento debe ser mayor a 0.");

      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería lanzar error si el valor del descuento es negativo", async () => {
      await expect(
        service.createCoupon({ ...BASE_DATA, type: DiscountType.porcentaje, value: -5 })
      ).rejects.toThrow("El valor del descuento debe ser mayor a 0.");
    });

    it("debería lanzar error si PERCENTAGE supera el 100%", async () => {
      await expect(
        service.createCoupon({ ...BASE_DATA, type: DiscountType.porcentaje, value: 110 })
      ).rejects.toThrow("El descuento por porcentaje no puede superar el 100%.");
    });

    it("debería permitir FIXED con valor mayor a 100 (es monto, no porcentaje)", async () => {
      const couponData = { ...BASE_DATA, type: DiscountType.monto_fijo, value: 500 };
      mockRepository.execute.mockResolvedValue({ ...couponData, is_active: true });

      const result = await service.createCoupon(couponData);

      expect(result).toBeDefined();
    });

    it("debería lanzar error si el código del cupón está vacío", async () => {
      await expect(
        service.createCoupon({ ...BASE_DATA, code: "", type: DiscountType.monto_fijo, value: 50 })
      ).rejects.toThrow("El código del cupón es requerido.");
    });

    it("debería lanzar error si seller_id está vacío", async () => {
      await expect(
        service.createCoupon({ ...BASE_DATA, seller_id: "  ", type: DiscountType.monto_fijo, value: 50 })
      ).rejects.toThrow("El ID del vendedor es requerido.");
    });
  });

  // ── applyDiscount ──────────────────────────────────────────────────────
  describe("applyDiscount()", () => {
    it("debería aplicar descuento PERCENTAGE correctamente", () => {
      // 20% de 500 = 100 → final: 400
      const result = service.applyDiscount(500, DiscountType.porcentaje, 20);
      expect(result).toBe(400);
    });

    it("debería aplicar descuento FIXED correctamente", () => {
      // 500 - 150 = 350
      const result = service.applyDiscount(500, DiscountType.monto_fijo, 150);
      expect(result).toBe(350);
    });

    it("debería retornar 0 si el descuento FIXED supera el precio (no negativo)", () => {
      const result = service.applyDiscount(100, DiscountType.monto_fijo, 200);
      expect(result).toBe(0);
    });

    it("debería retornar 0 si el descuento es 100%", () => {
      const result = service.applyDiscount(300, DiscountType.porcentaje, 100);
      expect(result).toBe(0);
    });

    it("debería lanzar error si el precio es 0 o negativo", () => {
      expect(() => service.applyDiscount(0, DiscountType.monto_fijo, 50)).toThrow(
        "El precio debe ser mayor a 0."
      );
      expect(() => service.applyDiscount(-100, DiscountType.porcentaje, 10)).toThrow(
        "El precio debe ser mayor a 0."
      );
    });
  });
});