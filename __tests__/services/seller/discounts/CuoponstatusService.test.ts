/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Gestión de Estado de Cupones (Pruebas Unitarias)
 * Historia de Usuario: US004-C: Gestión de estado de cupones
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari Ramirez
 * FECHA: 11 de marzo de 2026
 */

import { CouponStatusService } from "@/services/seller/discounts/Cuoponstatus.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const COUPON_ID = "coupon-abc-001";

const mockActiveCoupon   = { id: COUPON_ID, code: "PROMO10", is_active: true };
const mockInactiveCoupon = { id: COUPON_ID, code: "PROMO10", is_active: false };

// ─── Suite US004-C ─────────────────────────────────────────────────────────
describe("CouponStatusService — US004-C: Gestión de estado", () => {
  let service: CouponStatusService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CouponStatusService(mockRepository as any);
  });

  // ── activateCoupon ───────────────────────────────────────────────────────
  describe("activateCoupon()", () => {
    it("debería llamar al repositorio con is_active = true", async () => {
      mockRepository.execute.mockResolvedValue(mockActiveCoupon);

      const result = await service.activateCoupon(COUPON_ID);

      expect(mockRepository.execute).toHaveBeenCalledWith(COUPON_ID, true);
      expect(result.is_active).toBe(true);
    });

    it("debería lanzar error si couponId está vacío", async () => {
      await expect(service.activateCoupon("")).rejects.toThrow(
        "El ID del cupón es requerido."
      );
      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería lanzar error si couponId es solo espacios", async () => {
      await expect(service.activateCoupon("   ")).rejects.toThrow(
        "El ID del cupón es requerido."
      );
    });

    it("debería propagar error del repositorio", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Cupón no encontrado"));

      await expect(service.activateCoupon(COUPON_ID)).rejects.toThrow(
        "Cupón no encontrado"
      );
    });
  });

  // ── deactivateCoupon ─────────────────────────────────────────────────────
  describe("deactivateCoupon()", () => {
    it("debería llamar al repositorio con is_active = false", async () => {
      mockRepository.execute.mockResolvedValue(mockInactiveCoupon);

      const result = await service.deactivateCoupon(COUPON_ID);

      expect(mockRepository.execute).toHaveBeenCalledWith(COUPON_ID, false);
      expect(result.is_active).toBe(false);
    });

    it("debería lanzar error si couponId está vacío", async () => {
      await expect(service.deactivateCoupon("")).rejects.toThrow(
        "El ID del cupón es requerido."
      );
      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería propagar error del repositorio", async () => {
      mockRepository.execute.mockRejectedValue(new Error("DB connection lost"));

      await expect(service.deactivateCoupon(COUPON_ID)).rejects.toThrow(
        "DB connection lost"
      );
    });
  });

  // ── toggleCoupon ─────────────────────────────────────────────────────────
  describe("toggleCoupon()", () => {
    it("debería desactivar un cupón activo (true → false)", async () => {
      mockRepository.execute.mockResolvedValue(mockInactiveCoupon);

      const result = await service.toggleCoupon(COUPON_ID, true);

      expect(mockRepository.execute).toHaveBeenCalledWith(COUPON_ID, false);
      expect(result.is_active).toBe(false);
    });

    it("debería activar un cupón inactivo (false → true)", async () => {
      mockRepository.execute.mockResolvedValue(mockActiveCoupon);

      const result = await service.toggleCoupon(COUPON_ID, false);

      expect(mockRepository.execute).toHaveBeenCalledWith(COUPON_ID, true);
      expect(result.is_active).toBe(true);
    });

    it("debería lanzar error si couponId está vacío", async () => {
      await expect(service.toggleCoupon("", true)).rejects.toThrow(
        "El ID del cupón es requerido."
      );
      expect(mockRepository.execute).not.toHaveBeenCalled();
    });
  });
});