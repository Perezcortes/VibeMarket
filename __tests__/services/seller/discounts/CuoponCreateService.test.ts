/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Configuración de Vigencia de Cupones (Pruebas Unitarias)
 * Historia de Usuario: US004-A: Vigencia de cupones
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

// ─── Helpers ───────────────────────────────────────────────────────────────
const futureDate  = () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // +7 días
const pastDate    = () => new Date(Date.now() - 1000 * 60 * 60 * 24);      // -1 día

const BASE_DATA = {
  seller_id: "seller-001",
  code: "VERANO10",
  type: DiscountType.porcentaje,
  value: 10,
};

// ─── Suite US004-A ─────────────────────────────────────────────────────────
describe("CouponCreateService — US004-A: Vigencia de cupones", () => {
  let service: CouponCreateService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CouponCreateService(mockRepository as any);
  });

  // ── createCoupon (validaciones de fecha) ──────────────────────────────
  describe("createCoupon() — validaciones de fecha", () => {
    it("debería crear cupón con fecha de expiración futura válida", async () => {
      const expires = futureDate();
      mockRepository.execute.mockResolvedValue({ ...BASE_DATA, expires_at: expires, is_active: true });

      const result = await service.createCoupon({ ...BASE_DATA, expires_at: expires });

      expect(mockRepository.execute).toHaveBeenCalledWith(
        expect.objectContaining({ expires_at: expires })
      );
      expect(result.is_active).toBe(true);
    });

    it("debería crear cupón sin fecha de expiración (vigencia indefinida)", async () => {
      mockRepository.execute.mockResolvedValue({ ...BASE_DATA, is_active: true });

      const result = await service.createCoupon({ ...BASE_DATA });

      // Cuando expires_at no se proporciona, la clave no existe en el objeto enviado
      // (DateTime? en Prisma acepta ausencia de la clave, no solo undefined)
      const callArg = mockRepository.execute.mock.calls[0][0];
      expect(callArg).not.toHaveProperty("expires_at");
      expect(result).toBeDefined();
    });

    it("debería lanzar error si la fecha de expiración ya pasó", async () => {
      await expect(
        service.createCoupon({ ...BASE_DATA, expires_at: pastDate() })
      ).rejects.toThrow("La fecha de expiración debe ser futura.");

      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería lanzar error si la fecha de expiración es exactamente ahora (borde)", async () => {
      // Fecha en el pasado inmediato (simulamos 'ahora' como pasado)
      const justNow = new Date(Date.now() - 1);

      await expect(
        service.createCoupon({ ...BASE_DATA, expires_at: justNow })
      ).rejects.toThrow("La fecha de expiración debe ser futura.");
    });

    it("debería propagar error del repositorio al guardar", async () => {
      mockRepository.execute.mockRejectedValue(new Error("DB error"));

      await expect(
        service.createCoupon({ ...BASE_DATA, expires_at: futureDate() })
      ).rejects.toThrow("DB error");
    });
  });

  // ── isStillValid ──────────────────────────────────────────────────────
  describe("isStillValid()", () => {
    it("debería retornar true si la fecha de expiración es futura", () => {
      expect(service.isStillValid(futureDate())).toBe(true);
    });

    it("debería retornar false si la fecha de expiración ya pasó", () => {
      expect(service.isStillValid(pastDate())).toBe(false);
    });

    it("debería retornar true si no hay fecha de expiración (cupón permanente)", () => {
      expect(service.isStillValid(undefined)).toBe(true);
    });
  });
});