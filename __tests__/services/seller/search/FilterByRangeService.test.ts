/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Filtros Avanzados (Pruebas Unitarias)
 * Historia de Usuario: HU011 - Filtrado de productos por rango de precio
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { ProductPriceFilterService } from "@/services/seller/search/FilterByPriceRange.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  getPriceRangeBounds: jest.fn(),
  execute: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const mockBounds = {
  min: 50.00,
  max: 5000.00,
};

const mockProducts = [
  {
    id: "prod-101",
    name: "Audífonos Bluetooth",
    slug: "audifonos-bluetooth",
    price: 1200.00,
    category: { name: "Electrónica" },
    images: [{ url: "http://image.com/audifonos.jpg" }],
  },
  {
    id: "prod-102",
    name: "Teclado Mecánico",
    slug: "teclado-mecanico",
    price: 2500.00,
    category: null,
    images: [],
  }
];

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("ProductPriceFilterService — HU011", () => {
  let service: ProductPriceFilterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductPriceFilterService(mockRepository as any);
  });

  // ── getBudgetLimits ──────────────────────────────────────────────────────
  describe("getBudgetLimits()", () => {
    it("debería retornar los límites de precio mínimo y máximo como números", async () => {
      mockRepository.getPriceRangeBounds.mockResolvedValue(mockBounds);

      const result = await service.getBudgetLimits();

      expect(mockRepository.getPriceRangeBounds).toHaveBeenCalled();
      expect(result.min).toBe(50);
      expect(result.max).toBe(5000);
      expect(typeof result.min).toBe("number");
    });

    it("debería manejar valores nulos del repositorio devolviendo cero", async () => {
      mockRepository.getPriceRangeBounds.mockResolvedValue({ min: null, max: null });

      const result = await service.getBudgetLimits();

      expect(result.min).toBe(0);
      expect(result.max).toBe(0);
    });
  });

  // ── getProductsByBudget ──────────────────────────────────────────────────
  describe("getProductsByBudget()", () => {
    it("debería retornar productos dentro del rango de precio especificado", async () => {
      mockRepository.execute.mockResolvedValue(mockProducts);

      const result = await service.getProductsByBudget(1000, 3000);

      expect(mockRepository.execute).toHaveBeenCalledWith({
        minPrice: 1000,
        maxPrice: 3000,
        categorySlug: undefined
      });
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(1200);
      expect(result[0].categoryName).toBe("Electrónica");
    });

    it("debería lanzar error si el precio mínimo es mayor al máximo", async () => {
      await expect(service.getProductsByBudget(500, 100))
        .rejects.toThrow("El precio mínimo no puede ser mayor al precio máximo.");
      
      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería lanzar error si se envían precios negativos", async () => {
      await expect(service.getProductsByBudget(-10, 100))
        .rejects.toThrow("Los precios no pueden ser valores negativos.");
    });

    it("debería asignar 'General' si el producto no tiene categoría", async () => {
      mockRepository.execute.mockResolvedValue([mockProducts[1]]);

      const result = await service.getProductsByBudget(2000, 3000);

      expect(result[0].categoryName).toBe("General");
    });

    it("debería asignar null en imageUrl si el producto no tiene imágenes", async () => {
      mockRepository.execute.mockResolvedValue([mockProducts[1]]);

      const result = await service.getProductsByBudget(2000, 3000);

      expect(result[0].imageUrl).toBeNull();
    });

    it("debería filtrar por categoría opcional si se proporciona el slug", async () => {
      mockRepository.execute.mockResolvedValue([]);

      await service.getProductsByBudget(100, 500, "hogar");

      expect(mockRepository.execute).toHaveBeenCalledWith({
        minPrice: 100,
        maxPrice: 500,
        categorySlug: "hogar"
      });
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Query Failed"));

      await expect(service.getProductsByBudget(0, 1000)).rejects.toThrow("Query Failed");
    });
  });
});