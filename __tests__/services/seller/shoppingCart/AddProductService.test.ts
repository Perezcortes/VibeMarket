/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras (Pruebas Unitarias)
 * Historia de Usuario: HU013 - Agregar productos al carrito
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { CartService } from "@/services/seller/shoppingCart/AddProduct.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  checkStock: jest.fn(),
  execute: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const USER_ID = "user-cart-001";
const PRODUCT_ID = "prod-cart-001";

const mockProductStock = {
  name: "Camisa de Lino",
  stock: 10,
};

const mockCartItemResult = {
  id: "item-123",
  cart_id: "cart-456",
  product_id: PRODUCT_ID,
  quantity: 2,
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("CartService — HU013", () => {
  let service: CartService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CartService(mockRepository as any);
  });

  // ── addProduct ───────────────────────────────────────────────────────────
  describe("addProduct()", () => {
    it("debería añadir un producto al carrito exitosamente si hay stock", async () => {
      mockRepository.checkStock.mockResolvedValue(mockProductStock);
      mockRepository.execute.mockResolvedValue(mockCartItemResult);

      const result = await service.addProduct({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 2,
      });

      expect(mockRepository.checkStock).toHaveBeenCalledWith(PRODUCT_ID);
      expect(mockRepository.execute).toHaveBeenCalledWith({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 2,
      });
      expect(result.message).toBe("Producto añadido al carrito con éxito.");
      expect(result.item.quantity).toBe(2);
    });

    it("debería lanzar error si la cantidad es menor o igual a 0", async () => {
      await expect(service.addProduct({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 0,
      })).rejects.toThrow("La cantidad debe ser mayor a 0.");

      expect(mockRepository.checkStock).not.toHaveBeenCalled();
    });

    it("debería lanzar error si el producto no existe", async () => {
      mockRepository.checkStock.mockResolvedValue(null);

      await expect(service.addProduct({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 1,
      })).rejects.toThrow("El producto seleccionado ya no existe.");
    });

    it("debería lanzar error si el producto está agotado (stock 0)", async () => {
      mockRepository.checkStock.mockResolvedValue({ ...mockProductStock, stock: 0 });

      await expect(service.addProduct({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 1,
      })).rejects.toThrow('Lo sentimos, el producto "Camisa de Lino" está agotado.');
    });

    it("debería lanzar error si la cantidad solicitada supera el stock disponible", async () => {
      mockRepository.checkStock.mockResolvedValue(mockProductStock); // Stock es 10

      await expect(service.addProduct({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 15,
      })).rejects.toThrow('Solo quedan 10 unidades disponibles de "Camisa de Lino".');
    });

    it("debería propagar errores de persistencia del repositorio", async () => {
      mockRepository.checkStock.mockResolvedValue(mockProductStock);
      mockRepository.execute.mockRejectedValue(new Error("Database error"));

      await expect(service.addProduct({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 1,
      })).rejects.toThrow("No se pudo actualizar el carrito. Inténtalo de nuevo.");
    });

    it("debería registrar el error en consola cuando falla la ejecución", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockRepository.checkStock.mockResolvedValue(mockProductStock);
      mockRepository.execute.mockRejectedValue(new Error("Fail"));

      await expect(service.addProduct({
        userId: USER_ID,
        productId: PRODUCT_ID,
        quantity: 1,
      })).rejects.toThrow();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});