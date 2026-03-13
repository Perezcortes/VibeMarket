/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras (Pruebas Unitarias)
 * Historia de Usuario: HU014 - Selección de cantidad de artículos
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { CartQuantityService } from "@/services/seller/shoppingCart/ProductQuanrtity.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  updateQuantity: jest.fn(),
  removeItem: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const CART_ITEM_ID = "item-qty-123";

const mockUpdatedResult = {
  id: CART_ITEM_ID,
  quantity: 5,
  product: {
    name: "Sudadera Hoodie",
    price: 600.00,
  }
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("CartQuantityService — HU014", () => {
  let service: CartQuantityService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CartQuantityService(mockRepository as any);
  });

  // ── setItemQuantity ──────────────────────────────────────────────────────
  describe("setItemQuantity()", () => {
    it("debería actualizar la cantidad correctamente y calcular el total", async () => {
      mockRepository.updateQuantity.mockResolvedValue(mockUpdatedResult);

      const result = await service.setItemQuantity(CART_ITEM_ID, 5) as any;

      expect(mockRepository.updateQuantity).toHaveBeenCalledWith({
        cartItemId: CART_ITEM_ID,
        newQuantity: 5
      });
      expect(result.quantity).toBe(5);
      expect(result.totalPrice).toBe(3000); 
      expect(result.wasAdjustedByStock).toBe(false);
    });

    it("debería eliminar el producto si la cantidad solicitada es 0", async () => {
      mockRepository.removeItem.mockResolvedValue({ id: CART_ITEM_ID });

      const result = await service.setItemQuantity(CART_ITEM_ID, 0);

      expect(mockRepository.removeItem).toHaveBeenCalledWith(CART_ITEM_ID);
      expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Producto eliminado del carrito.");
    });

    it("debería marcar wasAdjustedByStock como true si la cantidad resultante es menor a la pedida", async () => {
      mockRepository.updateQuantity.mockResolvedValue({
        ...mockUpdatedResult,
        quantity: 5
      });

      const result = await service.setItemQuantity(CART_ITEM_ID, 10) as any;

      expect(result.quantity).toBe(5);
      expect(result.wasAdjustedByStock).toBe(true);
    });

    it("debería lanzar un error si la cantidad es negativa", async () => {
      await expect(service.setItemQuantity(CART_ITEM_ID, -1))
        .rejects.toThrow("La cantidad no puede ser negativa.");
      
      expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
    });

    it("debería manejar correctamente la conversión de Decimal a number en el precio", async () => {
      // CORRECCIÓN: Forzamos que el mock devuelva quantity: 2 para que coincida con el cálculo
      mockRepository.updateQuantity.mockResolvedValue({
        id: CART_ITEM_ID,
        quantity: 2, 
        product: { 
          name: "Sudadera Hoodie", 
          price: "150.50" 
        }
      });

      const result = await service.setItemQuantity(CART_ITEM_ID, 2) as any;

      expect(result.unitPrice).toBe(150.50);
      expect(result.totalPrice).toBe(301); // 2 * 150.50 = 301. Ahora sí pasará.
      expect(typeof result.unitPrice).toBe("number");
    });

    it("debería propagar errores si el repositorio falla al actualizar", async () => {
      mockRepository.updateQuantity.mockRejectedValue(new Error("Update failed"));

      await expect(service.setItemQuantity(CART_ITEM_ID, 3)).rejects.toThrow("Update failed");
    });

    it("debería propagar errores si el repositorio falla al eliminar (cantidad 0)", async () => {
      mockRepository.removeItem.mockRejectedValue(new Error("Delete failed"));

      await expect(service.setItemQuantity(CART_ITEM_ID, 0)).rejects.toThrow("Delete failed");
    });
  });
});