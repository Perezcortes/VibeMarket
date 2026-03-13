/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Ordenamiento (Pruebas Unitarias)
 * Historia de Usuario: HU012 - Ordenamiento de artículos por precio
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { ProductSortService } from "@/services/seller/search/SortByPrice.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const mockSortedProducts = [
  {
    id: "prod-sort-001",
    name: "Smartphone Premium",
    slug: "smartphone-premium",
    price: 25000.00,
    category: { name: "Celulares" },
    images: [{ url: "http://image.com/phone.jpg" }],
  },
  {
    id: "prod-sort-002",
    name: "Audífonos Básicos",
    slug: "audifonos-basicos",
    price: 500.00,
    category: null,
    images: [],
  }
];

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("ProductSortService — HU012", () => {
  let service: ProductSortService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductSortService(mockRepository as any);
  });

  // ── getProductsSortedByPrice ─────────────────────────────────────────────
  describe("getProductsSortedByPrice()", () => {
    it("debería retornar productos ordenados de mayor a menor (desc) por defecto", async () => {
      mockRepository.execute.mockResolvedValue(mockSortedProducts);

      const result = await service.getProductsSortedByPrice();

      expect(mockRepository.execute).toHaveBeenCalledWith("desc");
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(25000);
      expect(typeof result[0].price).toBe("number");
    });

    it("debería solicitar ordenamiento ascendente (asc) cuando se especifique", async () => {
      mockRepository.execute.mockResolvedValue([...mockSortedProducts].reverse());

      const result = await service.getProductsSortedByPrice("asc");

      expect(mockRepository.execute).toHaveBeenCalledWith("asc");
      expect(result[0].price).toBe(500);
    });

    it("debería lanzar un error si la dirección de ordenamiento no es válida", async () => {
      // Forzamos un cast a 'any' para probar la validación de tiempo de ejecución
      await expect(service.getProductsSortedByPrice("invalid" as any))
        .rejects.toThrow("Dirección de ordenamiento no válida. Use 'asc' o 'desc'.");
      
      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería asignar 'General' cuando la categoría es null", async () => {
      mockRepository.execute.mockResolvedValue([mockSortedProducts[1]]);

      const result = await service.getProductsSortedByPrice("asc");

      expect(result[0].categoryName).toBe("General");
    });

    it("debería asignar null en imageUrl si el producto no tiene imágenes", async () => {
      mockRepository.execute.mockResolvedValue([mockSortedProducts[1]]);

      const result = await service.getProductsSortedByPrice("asc");

      expect(result[0].imageUrl).toBeNull();
    });

    it("debería manejar correctamente la conversión de Decimal a number", async () => {
      mockRepository.execute.mockResolvedValue([{
        ...mockSortedProducts[0],
        price: "1500.99" // Simulación de string Decimal
      }]);

      const result = await service.getProductsSortedByPrice("desc");

      expect(result[0].price).toBe(1500.99);
      expect(typeof result[0].price).toBe("number");
    });

    it("debería propagar errores si el repositorio falla", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Database connection error"));

      await expect(service.getProductsSortedByPrice("desc")).rejects.toThrow("Database connection error");
    });
  });
});