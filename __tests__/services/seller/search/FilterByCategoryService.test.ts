/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Filtros (Pruebas Unitarias)
 * Historia de Usuario: HU010 - Filtrado de productos por categoría
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { ProductCategoryFilterService } from "@/services/seller/search/FiltrerByCategory.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  getAllCategories: jest.fn(),
  execute: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const CATEGORY_SLUG = "electronica";

const mockCategories = [
  {
    id: 1,
    name: "Electrónica",
    slug: "electronica",
    _count: { products: 15 },
  },
  {
    id: 2,
    name: "Hogar",
    slug: "hogar",
    _count: { products: 8 },
  },
];

const mockProductsByCategory = [
  {
    id: "prod-001",
    name: "Televisor 4K",
    slug: "televisor-4k",
    price: 8500.00,
    stock: 20,
    category: { name: "Electrónica" },
    images: [{ url: "http://image.com/tv.jpg" }],
  },
];

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("ProductCategoryFilterService — HU010", () => {
  let service: ProductCategoryFilterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductCategoryFilterService(mockRepository as any);
  });

  // ── getCategoryMenu ──────────────────────────────────────────────────────
  describe("getCategoryMenu()", () => {
    it("debería retornar el menú de categorías con IDs convertidos a string", async () => {
      mockRepository.getAllCategories.mockResolvedValue(mockCategories);

      const result = await service.getCategoryMenu();

      expect(mockRepository.getAllCategories).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1"); // Validación de conversión String(cat.id)
      expect(typeof result[0].id).toBe("string");
      expect(result[0].productCount).toBe(15);
    });

    it("debería retornar arreglo vacío si no hay categorías", async () => {
      mockRepository.getAllCategories.mockResolvedValue([]);

      const result = await service.getCategoryMenu();

      expect(result).toEqual([]);
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.getAllCategories.mockRejectedValue(new Error("Database connection lost"));

      await expect(service.getCategoryMenu()).rejects.toThrow("Database connection lost");
    });
  });

  // ── getProductsByCategory ────────────────────────────────────────────────
  describe("getProductsByCategory()", () => {
    it("debería retornar productos filtrados por el slug de categoría", async () => {
      mockRepository.execute.mockResolvedValue(mockProductsByCategory);

      const result = await service.getProductsByCategory(CATEGORY_SLUG);

      expect(mockRepository.execute).toHaveBeenCalledWith(CATEGORY_SLUG);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Televisor 4K");
      expect(result[0].price).toBe(8500.00);
      expect(typeof result[0].price).toBe("number");
    });

    it("debería lanzar error si el slug de categoría es vacío o nulo", async () => {
      await expect(service.getProductsByCategory("")).rejects.toThrow(
        "El slug de la categoría es requerido para filtrar."
      );

      await expect(service.getProductsByCategory("   ")).rejects.toThrow(
        "El slug de la categoría es requerido para filtrar."
      );
    });

    it("debería asignar 'Sin categoría' si el producto no tiene la relación cargada", async () => {
      mockRepository.execute.mockResolvedValue([{
        ...mockProductsByCategory[0],
        category: null
      }]);

      const result = await service.getProductsByCategory(CATEGORY_SLUG);

      expect(result[0].categoryName).toBe("Sin categoría");
    });

    it("debería manejar productos sin imágenes asignando null en imageUrl", async () => {
      mockRepository.execute.mockResolvedValue([{
        ...mockProductsByCategory[0],
        images: []
      }]);

      const result = await service.getProductsByCategory(CATEGORY_SLUG);

      expect(result[0].imageUrl).toBeNull();
    });

    it("debería propagar errores si el repositorio falla al ejecutar el filtro", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Timeout error"));

      await expect(service.getProductsByCategory(CATEGORY_SLUG)).rejects.toThrow("Timeout error");
    });
  });
});