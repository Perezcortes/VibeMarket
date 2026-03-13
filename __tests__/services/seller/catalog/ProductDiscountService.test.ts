/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Visualización de Ofertas y Descuentos (Pruebas Unitarias)
 * Historia de Usuario: HU003 - Visualización de ofertas y descuentos
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { ProductDiscountService } from "@/services/seller/catalog/ProductDiscount.service";
import { DiscountType } from "@prisma/client";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const PRODUCT_SLUG = "laptop-pro-2026";

const mockProductData = {
  id: "prod-001",
  name: "Laptop Pro",
  price: 20000, // Precio base
  seller: {
    full_name: "TechStore Oficial",
    coupons: [
      {
        code: "DESC10",
        type: DiscountType.porcentaje,
        value: 10,
      },
      {
        code: "FIXED500",
        type: DiscountType.monto_fijo,
        value: 500,
      }
    ]
  }
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("ProductDiscountService — HU003", () => {
  let service: ProductDiscountService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductDiscountService(mockRepository as any);
  });

  // ── getProductWithOffers ─────────────────────────────────────────────────
  describe("getProductWithOffers()", () => {
    it("debería retornar el producto con todos los descuentos calculados", async () => {
      mockRepository.execute.mockResolvedValue(mockProductData);

      const result = await service.getProductWithOffers(PRODUCT_SLUG);

      expect(mockRepository.execute).toHaveBeenCalledWith(PRODUCT_SLUG);
      expect(result.originalPrice).toBe(20000);
      expect(result.availableDiscounts).toHaveLength(2);

      // Validar descuento porcentual (10% de 20000 = 2000 ahorro)
      const percentDisc = result.availableDiscounts.find(d => d.code === "DESC10");
      expect(percentDisc?.finalPrice).toBe(18000);
      expect(percentDisc?.savings).toBe(2000);

      // Validar descuento fijo (20000 - 500 = 19500)
      const fixedDisc = result.availableDiscounts.find(d => d.code === "FIXED500");
      expect(fixedDisc?.finalPrice).toBe(19500);
      expect(fixedDisc?.savings).toBe(500);
    });

    it("debería lanzar un error si el producto no existe", async () => {
      mockRepository.execute.mockResolvedValue(null);

      await expect(service.getProductWithOffers("invalido")).rejects.toThrow(
        "El producto no existe o no se encuentra disponible."
      );
    });

    it("debería manejar correctamente precios que vienen como Decimal (strings)", async () => {
      const mockWithDecimal = {
        ...mockProductData,
        price: "100.00",
        seller: {
          ...mockProductData.seller,
          coupons: [{ code: "PROMO", type: DiscountType.porcentaje, value: "5.00" }]
        }
      };
      mockRepository.execute.mockResolvedValue(mockWithDecimal);

      const result = await service.getProductWithOffers(PRODUCT_SLUG);

      expect(result.originalPrice).toBe(100);
      expect(result.availableDiscounts[0].finalPrice).toBe(95);
      expect(typeof result.originalPrice).toBe("number");
    });

    it("debería asegurar que el precio final no sea menor a cero", async () => {
      const mockAggressiveDiscount = {
        ...mockProductData,
        price: 100,
        seller: {
          ...mockProductData.seller,
          coupons: [{ code: "SUPER", type: DiscountType.monto_fijo, value: 150 }]
        }
      };
      mockRepository.execute.mockResolvedValue(mockAggressiveDiscount);

      const result = await service.getProductWithOffers(PRODUCT_SLUG);

      expect(result.availableDiscounts[0].finalPrice).toBe(0);
      expect(result.availableDiscounts[0].savings).toBe(100);
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Database Timeout"));

      await expect(service.getProductWithOffers(PRODUCT_SLUG)).rejects.toThrow(
        "Database Timeout"
      );
    });
  });

  // ── calculateFinalPrice (Prueba de lógica privada vía método público) ────
  describe("Lógica de cálculo de descuentos", () => {
    it("debería aplicar correctamente un descuento porcentual", async () => {
      mockRepository.execute.mockResolvedValue({
        ...mockProductData,
        price: 1000,
        seller: { coupons: [{ type: DiscountType.porcentaje, value: 25 }] }
      });

      const result = await service.getProductWithOffers(PRODUCT_SLUG);
      expect(result.availableDiscounts[0].finalPrice).toBe(750);
    });

    it("debería aplicar correctamente un descuento de monto fijo", async () => {
      mockRepository.execute.mockResolvedValue({
        ...mockProductData,
        price: 1000,
        seller: { coupons: [{ type: DiscountType.monto_fijo, value: 250 }] }
      });

      const result = await service.getProductWithOffers(PRODUCT_SLUG);
      expect(result.availableDiscounts[0].finalPrice).toBe(750);
    });
  });
});