/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Checkout y Gestión de Inventario (Pruebas Unitarias)
 * Historia de Usuario: HU017 - Bloqueo de compra por falta de stock
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { CheckoutService } from "@/services/seller/shoppingCart/BlockOrder.service";

// ─── Mocks de los Repositorios ─────────────────────────────────────────────
const mockStockGuardRepository = {
  secureCheckout: jest.fn(),
};

const mockCartRepository = {
  getSavedCart: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const USER_ID = "user-123";
const ADDRESS_ID = "addr-456";

const mockCartWithItems = {
  id: "cart-001",
  items: [
    {
      product_id: "prod-001",
      quantity: 2,
      product: {
        price: 500.00,
        name: "Producto A"
      }
    }
  ]
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("CheckoutService — HU017", () => {
  let service: CheckoutService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CheckoutService(
      mockStockGuardRepository as any,
      mockCartRepository as any
    );
  });

  // ── processPurchase ──────────────────────────────────────────────────────
  describe("processPurchase()", () => {
    it("debería procesar la compra exitosamente cuando hay stock y el carrito tiene items", async () => {
      mockCartRepository.getSavedCart.mockResolvedValue(mockCartWithItems);
      mockStockGuardRepository.secureCheckout.mockResolvedValue({ id: "order-999" });

      const result = await service.processPurchase({
        userId: USER_ID,
        addressId: ADDRESS_ID
      });

      expect(mockCartRepository.getSavedCart).toHaveBeenCalledWith(USER_ID);
      expect(mockStockGuardRepository.secureCheckout).toHaveBeenCalledWith({
        userId: USER_ID,
        addressId: ADDRESS_ID,
        cartItems: [
          { productId: "prod-001", quantity: 2, price: 500 }
        ]
      });
      expect(result.success).toBe(true);
      expect(result.orderId).toBe("order-999");
      expect(result.message).toContain("éxito");
    });

    it("debería lanzar error si el carrito no existe o está vacío", async () => {
      mockCartRepository.getSavedCart.mockResolvedValue({ items: [] });

      await expect(service.processPurchase({ userId: USER_ID, addressId: ADDRESS_ID }))
        .rejects.toThrow("No puedes procesar una compra con el carrito vacío.");
      
      expect(mockStockGuardRepository.secureCheckout).not.toHaveBeenCalled();
    });

    it("debería manejar errores de stock lanzados por el repositorio (HU017)", async () => {
      mockCartRepository.getSavedCart.mockResolvedValue(mockCartWithItems);
      // Simulamos que el repo detecta falta de stock durante la transacción
      mockStockGuardRepository.secureCheckout.mockRejectedValue(
        new Error("Stock insuficiente para el producto: Producto A")
      );

      const result = await service.processPurchase({
        userId: USER_ID,
        addressId: ADDRESS_ID
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("La compra no pudo completarse debido a falta de disponibilidad.");
      expect(result.errorDetails).toContain("Stock insuficiente para el producto: Producto A");
    });

    it("debería convertir correctamente los precios Decimal a number antes de la transacción", async () => {
      mockCartRepository.getSavedCart.mockResolvedValue({
        items: [{
          product_id: "p1",
          quantity: 1,
          product: { price: "150.50" } // String Decimal
        }]
      });
      mockStockGuardRepository.secureCheckout.mockResolvedValue({ id: "ok" });

      await service.processPurchase({ userId: USER_ID, addressId: ADDRESS_ID });

      expect(mockStockGuardRepository.secureCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          cartItems: [{ productId: "p1", quantity: 1, price: 150.50 }]
        })
      );
    });

    it("debería registrar el error en consola cuando falla la transacción", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockCartRepository.getSavedCart.mockResolvedValue(mockCartWithItems);
      mockStockGuardRepository.secureCheckout.mockRejectedValue(new Error("Database Timeout"));

      await service.processPurchase({ userId: USER_ID, addressId: ADDRESS_ID });

      expect(consoleSpy).toHaveBeenCalledWith("Fallo en el checkout:", "Database Timeout");
      consoleSpy.mockRestore();
    });
  });
});