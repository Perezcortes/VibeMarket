/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Información de Producto (Pruebas Unitarias)
 * Historia de Usuario: HU007 - Visualización de precio de producto
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { ProductPriceService } from "@/services/seller/catalog/ProductPrice.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const PRODUCT_ID = "prod-price-001";

const mockProduct = {
  id: PRODUCT_ID,
  name: "Smartphone X",
  price: 15000.50,
  stock: 10,
  is_active: true,
  category: {
    name: "Electrónica",
  },
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("ProductPriceService — HU007", () => {
  let service: ProductPriceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductPriceService(mockRepository as any);
  });

  // ── getProductPriceInfo ──────────────────────────────────────────────────
  describe("getProductPriceInfo()", () => {
    it("debería retornar la información de precio y disponibilidad formateada", async () => {
      mockRepository.execute.mockResolvedValue(mockProduct);

      const result = await service.getProductPriceInfo(PRODUCT_ID);

      expect(mockRepository.execute).toHaveBeenCalledWith(PRODUCT_ID);
      expect(result.id).toBe(PRODUCT_ID);
      expect(result.price).toBe(15000.50);
      expect(result.formattedPrice).toContain("$15,000.50");
      expect(result.isAvailable).toBe(true);
      expect(result.categoryName).toBe("Electrónica");
    });

    it("debería marcar isAvailable como false si el stock es 0", async () => {
      mockRepository.execute.mockResolvedValue({
        ...mockProduct,
        stock: 0,
      });

      const result = await service.getProductPriceInfo(PRODUCT_ID);

      expect(result.stock).toBe(0);
      expect(result.isAvailable).toBe(false);
    });

    it("debería retornar 'Sin categoría' si la relación category es null", async () => {
      mockRepository.execute.mockResolvedValue({
        ...mockProduct,
        category: null,
      });

      const result = await service.getProductPriceInfo(PRODUCT_ID);

      expect(result.categoryName).toBe("Sin categoría");
    });

    it("debería lanzar error si el producto no existe (null)", async () => {
      mockRepository.execute.mockResolvedValue(null);

      await expect(service.getProductPriceInfo(PRODUCT_ID)).rejects.toThrow(
        "El producto solicitado no está disponible actualmente."
      );
    });

    it("debería convertir correctamente precios tipo Decimal a number", async () => {
      mockRepository.execute.mockResolvedValue({
        ...mockProduct,
        price: "1200.75", // Simulación de string Decimal de Prisma
      });

      const result = await service.getProductPriceInfo(PRODUCT_ID);

      expect(result.price).toBe(1200.75);
      expect(typeof result.price).toBe("number");
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Database Failure"));

      await expect(service.getProductPriceInfo(PRODUCT_ID)).rejects.toThrow(
        "Database Failure"
      );
    });
  });

  // ── formatCurrency (Prueba de lógica interna) ─────────────────────────────
  describe("formatCurrency()", () => {
    it("debería aplicar el formato de moneda MXN correctamente", async () => {
      // Accedemos al método privado mediante cast a 'any' para la prueba
      const formatted = (service as any).formatCurrency(500);
      
      // Verificamos que contenga el símbolo de pesos y el formato esperado
      // Nota: El espacio entre $ y el número puede variar según el entorno, usamos contain
      expect(formatted).toMatch(/\$500\.00/);
    });
  });
});