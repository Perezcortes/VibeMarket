/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras (Pruebas Unitarias)
 * Historia de Usuario: HU015 - Eliminar artículos del carrito
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { CartRemoveService } from "@/services/seller/shoppingCart/DeletProduct.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
  clearCart: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const CART_ITEM_ID = "item-rem-001";
const USER_ID = "user-rem-123";

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("CartRemoveService — HU015", () => {
  let service: CartRemoveService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CartRemoveService(mockRepository as any);
  });

  // ── removeSingleItem ─────────────────────────────────────────────────────
  describe("removeSingleItem()", () => {
    it("debería eliminar un producto del carrito y retornar éxito", async () => {
      mockRepository.execute.mockResolvedValue({ id: CART_ITEM_ID });

      const result = await service.removeSingleItem(CART_ITEM_ID);

      expect(mockRepository.execute).toHaveBeenCalledWith(CART_ITEM_ID);
      expect(result.success).toBe(true);
      expect(result.action).toBe("remove_item");
      expect(result.message).toContain("correctamente");
    });

    it("debería lanzar error si el cartItemId está vacío", async () => {
      await expect(service.removeSingleItem("")).rejects.toThrow(
        "El ID del artículo es requerido para eliminarlo."
      );
      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería lanzar un mensaje amigable si el ítem no existe (Error en Repo)", async () => {
      // Simulamos que el delete de Prisma falla porque el registro no existe
      mockRepository.execute.mockRejectedValue(new Error("Record to delete does not exist"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(service.removeSingleItem(CART_ITEM_ID)).rejects.toThrow(
        "No se pudo eliminar el artículo. Es posible que ya haya sido removido."
      );

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  // ── clearAllCart ─────────────────────────────────────────────────────────
  describe("clearAllCart()", () => {
    it("debería vaciar el carrito completamente", async () => {
      mockRepository.clearCart.mockResolvedValue({ count: 5 });

      const result = await service.clearAllCart(USER_ID);

      expect(mockRepository.clearCart).toHaveBeenCalledWith(USER_ID);
      expect(result.success).toBe(true);
      expect(result.action).toBe("clear_cart");
      expect(result.message).toContain("eliminado todos los productos");
    });

    it("debería lanzar error si el userId está vacío", async () => {
      await expect(service.clearAllCart("")).rejects.toThrow(
        "El ID de usuario es requerido para vaciar el carrito."
      );
    });

    it("debería retornar success: false si el usuario no tiene un carrito activo", async () => {
      // El repositorio devuelve null si no encuentra el carrito
      mockRepository.clearCart.mockResolvedValue(null);

      const result = await service.clearAllCart(USER_ID);

      expect(result.success).toBe(false);
      expect(result.message).toBe("No se encontró un carrito activo para este usuario.");
    });

    it("debería propagar errores inesperados del repositorio", async () => {
      mockRepository.clearCart.mockRejectedValue(new Error("Database Failure"));

      await expect(service.clearAllCart(USER_ID)).rejects.toThrow("Database Failure");
    });
  });
});