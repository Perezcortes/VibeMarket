/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras (Pruebas Unitarias)
 * Historia de Usuario: HU016 - Persistencia del carrito entre sesiones
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { CartPersistenceService } from "@/services/seller/shoppingCart/SaveCart.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  getSavedCart: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const USER_ID = "user-save-123";
const UPDATED_DATE = new Date("2026-03-12T10:00:00Z");

const mockSavedCart = {
  id: "cart-999",
  updated_at: UPDATED_DATE,
  items: [
    {
      id: "item-1",
      quantity: 2,
      product: {
        id: "prod-001",
        name: "Mochila Urbana",
        slug: "mochila-urbana",
        price: 500.00,
        stock: 10,
        is_active: true,
        images: [{ url: "http://image.com/mochila.jpg" }],
      },
    },
    {
      id: "item-2",
      quantity: 1,
      product: {
        id: "prod-002",
        name: "Llavero (Inactivo)",
        slug: "llavero-inactivo",
        price: 50.00,
        stock: 5,
        is_active: false,
        images: [],
      },
    }
  ],
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("CartPersistenceService — HU016", () => {
  let service: CartPersistenceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CartPersistenceService(mockRepository as any);
  });

  // ── getCartContent ───────────────────────────────────────────────────────
  describe("getCartContent()", () => {
    it("debería recuperar el carrito, calcular totales y omitir montos de productos inactivos", async () => {
      mockRepository.getSavedCart.mockResolvedValue(mockSavedCart);

      const result = await service.getCartContent(USER_ID);

      expect(mockRepository.getSavedCart).toHaveBeenCalledWith(USER_ID);
      expect(result).not.toBeNull();
      expect(result?.cartId).toBe("cart-999");
      
      // Verificación de totales: (2 * 500) = 1000. El de 50 no se suma porque isActive es false.
      expect(result?.totalAmount).toBe(1000);
      expect(result?.itemCount).toBe(3); // 2 + 1
      
      // Verificación de mapeo de items
      expect(result?.items[0].hasStock).toBe(true);
      expect(result?.items[0].imageUrl).toBe("http://image.com/mochila.jpg");
    });

    it("debería retornar null si el repositorio no encuentra un carrito para el usuario", async () => {
      mockRepository.getSavedCart.mockResolvedValue(null);

      const result = await service.getCartContent(USER_ID);

      expect(result).toBeNull();
    });

    it("debería marcar hasStock como false si la cantidad en carrito supera el stock real", async () => {
      mockRepository.getSavedCart.mockResolvedValue({
        ...mockSavedCart,
        items: [{
          ...mockSavedCart.items[0],
          quantity: 20, // Supera el stock de 10
        }]
      });

      const result = await service.getCartContent(USER_ID);

      expect(result?.items[0].hasStock).toBe(false);
    });

    it("debería manejar correctamente precios que vienen como Decimal (strings)", async () => {
      mockRepository.getSavedCart.mockResolvedValue({
        ...mockSavedCart,
        items: [{
          ...mockSavedCart.items[0],
          product: { ...mockSavedCart.items[0].product, price: "150.50" }
        }]
      });

      const result = await service.getCartContent(USER_ID);

      expect(result?.items[0].unitPrice).toBe(150.50);
      expect(result?.items[0].subtotal).toBe(301.00); // 2 * 150.50
      expect(typeof result?.totalAmount).toBe("number");
    });

    it("debería asignar null en imageUrl si el producto no tiene imágenes guardadas", async () => {
      mockRepository.getSavedCart.mockResolvedValue(mockSavedCart);

      const result = await service.getCartContent(USER_ID);

      expect(result?.items[1].imageUrl).toBeNull();
    });

    it("debería propagar errores si el repositorio falla", async () => {
      mockRepository.getSavedCart.mockRejectedValue(new Error("Timeout DB"));

      await expect(service.getCartContent(USER_ID)).rejects.toThrow("Timeout DB");
    });
  });
});