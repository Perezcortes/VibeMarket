/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Gestión de Favoritos (Pruebas Unitarias)
 * Historia de Usuario: HU005 - Marcar favoritos para monitorear productos
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { FavoriteService } from "@/services/seller/catalog/FavoriteProduct.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  toggleFavorite: jest.fn(),
  getFavoritesByUser: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const USER_ID = "user-001";
const PRODUCT_ID = "prod-999";

const mockFavoriteList = [
  {
    product: {
      id: PRODUCT_ID,
      name: "Cámara DSLR",
      slug: "camara-dslr",
      price: 12500.50,
      stock: 5,
      is_active: true,
      images: [{ url: "http://image.com/camara.jpg" }],
    },
  },
];

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("FavoriteService — HU005", () => {
  let service: FavoriteService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FavoriteService(mockRepository as any);
  });

  // ── toggleProductFavorite ────────────────────────────────────────────────
  describe("toggleProductFavorite()", () => {
    it("debería retornar acción 'added' cuando se crea un nuevo favorito", async () => {
      // Simulamos que el repositorio crea el registro
      mockRepository.toggleFavorite.mockResolvedValue({ id: "fav-123" });
      
      // Forzamos que checkIfExists devuelva true para simular que AHORA existe
      jest.spyOn(service as any, 'checkIfExists').mockResolvedValue(true);

      const result = await service.toggleProductFavorite(USER_ID, PRODUCT_ID);

      expect(mockRepository.toggleFavorite).toHaveBeenCalledWith({
        user_id: USER_ID,
        product_id: PRODUCT_ID,
      });
      expect(result.action).toBe("added");
      expect(result.message).toContain("añadido");
    });

    it("debería retornar acción 'removed' cuando se elimina un favorito existente", async () => {
      // Simulamos que el repositorio borra el registro (retorna el objeto borrado)
      mockRepository.toggleFavorite.mockResolvedValue({ id: "fav-123" });
      
      // Forzamos que checkIfExists devuelva false para simular que YA NO existe
      jest.spyOn(service as any, 'checkIfExists').mockResolvedValue(false);

      const result = await service.toggleProductFavorite(USER_ID, PRODUCT_ID);

      expect(result.action).toBe("removed");
      expect(result.message).toContain("eliminado");
    });

    it("debería lanzar error si faltan los parámetros requeridos", async () => {
      await expect(service.toggleProductFavorite("", PRODUCT_ID)).rejects.toThrow(
        "El ID de usuario y el ID de producto son obligatorios."
      );
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.toggleFavorite.mockRejectedValue(new Error("DB Connection Error"));

      await expect(service.toggleProductFavorite(USER_ID, PRODUCT_ID)).rejects.toThrow(
        "DB Connection Error"
      );
    });
  });

  // ── getUserFavorites ─────────────────────────────────────────────────────
  describe("getUserFavorites()", () => {
    it("debería retornar la lista de favoritos mapeada correctamente", async () => {
      mockRepository.getFavoritesByUser.mockResolvedValue(mockFavoriteList);

      const result = await service.getUserFavorites(USER_ID);

      expect(mockRepository.getFavoritesByUser).toHaveBeenCalledWith(USER_ID);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(PRODUCT_ID);
      expect(typeof result[0].price).toBe("number");
      expect(result[0].price).toBe(12500.50);
      expect(result[0].imageUrl).toBe("http://image.com/camara.jpg");
    });

    it("debería manejar productos sin imágenes devolviendo null en imageUrl", async () => {
      const listNoImages = [{
        product: { ...mockFavoriteList[0].product, images: [] }
      }];
      mockRepository.getFavoritesByUser.mockResolvedValue(listNoImages);

      const result = await service.getUserFavorites(USER_ID);

      expect(result[0].imageUrl).toBeNull();
    });

    it("debería retornar un arreglo vacío si el usuario no tiene favoritos", async () => {
      mockRepository.getFavoritesByUser.mockResolvedValue([]);

      const result = await service.getUserFavorites(USER_ID);

      expect(result).toEqual([]);
    });

    it("debería convertir precios Decimal (string/objeto) a number correctamente", async () => {
      const listWithDecimal = [{
        product: { ...mockFavoriteList[0].product, price: "99.99" }
      }];
      mockRepository.getFavoritesByUser.mockResolvedValue(listWithDecimal);

      const result = await service.getUserFavorites(USER_ID);

      expect(result[0].price).toBe(99.99);
      expect(typeof result[0].price).toBe("number");
    });
  });
});