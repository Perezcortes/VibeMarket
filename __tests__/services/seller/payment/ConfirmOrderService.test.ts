/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Checkout y Confirmación (Pruebas Unitarias)
 * Historia de Usuario: HU019 - Confirmación de orden antes del pago
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { OrderConfirmationService } from "@/services/seller/payment/ConfirmOrder.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  getOrderSummary: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const ORDER_ID = "ord-confirm-001";

const mockOrderData = {
  id: ORDER_ID,
  total_amount: 2500.00,
  status: "pendiente",
  address: {
    street: "Av. Reforma 123",
    city: "Ciudad de México",
    state: "CDMX",
    postal_code: "01000",
    country: "México",
  },
  items: [
    {
      quantity: 2,
      unit_price: 1250.00,
      product: {
        name: "Silla Ergonómica",
        images: [{ url: "http://image.com/silla.jpg" }],
      },
    },
  ],
  payments: [
    {
      provider: "Stripe",
      status: "pendiente",
    },
  ],
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("OrderConfirmationService — HU019", () => {
  let service: OrderConfirmationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderConfirmationService(mockRepository as any);
  });

  // ── getOrderPreview ──────────────────────────────────────────────────────
  describe("getOrderPreview()", () => {
    it("debería retornar el resumen de la orden con dirección formateada y subtotales", async () => {
      mockRepository.getOrderSummary.mockResolvedValue(mockOrderData);

      const result = await service.getOrderPreview(ORDER_ID);

      expect(mockRepository.getOrderSummary).toHaveBeenCalledWith(ORDER_ID);
      
      // Validación de dirección consolidada
      expect(result.shippingAddress).toBe("Av. Reforma 123, Ciudad de México, CDMX, 01000, México");
      
      // Validación de cálculos
      expect(result.total).toBe(2500);
      expect(result.items[0].subtotal).toBe(2500); // 2 * 1250
      
      // Validación de pago
      expect(result.paymentMethod?.provider).toBe("Stripe");
    });

    it("debería lanzar error si la orden no existe (null)", async () => {
      mockRepository.getOrderSummary.mockResolvedValue(null);

      await expect(service.getOrderPreview(ORDER_ID)).rejects.toThrow(
        "La orden solicitada no existe."
      );
    });

    it("debería manejar órdenes sin método de pago asignado (null)", async () => {
      mockRepository.getOrderSummary.mockResolvedValue({
        ...mockOrderData,
        payments: [],
      });

      const result = await service.getOrderPreview(ORDER_ID);

      expect(result.paymentMethod).toBeNull();
    });

    it("debería manejar productos sin imágenes asignando null en imageUrl", async () => {
      mockRepository.getOrderSummary.mockResolvedValue({
        ...mockOrderData,
        items: [{
          ...mockOrderData.items[0],
          product: { ...mockOrderData.items[0].product, images: [] }
        }]
      });

      const result = await service.getOrderPreview(ORDER_ID);

      expect(result.items[0].imageUrl).toBeNull();
    });

    it("debería convertir correctamente precios Decimal de Prisma a number", async () => {
      mockRepository.getOrderSummary.mockResolvedValue({
        ...mockOrderData,
        total_amount: "150.50",
        items: [{
          ...mockOrderData.items[0],
          unit_price: "75.25"
        }]
      });

      const result = await service.getOrderPreview(ORDER_ID);

      expect(result.total).toBe(150.50);
      expect(result.items[0].price).toBe(75.25);
      expect(typeof result.total).toBe("number");
    });

    it("debería propagar errores si el repositorio falla", async () => {
      mockRepository.getOrderSummary.mockRejectedValue(new Error("Internal DB Error"));

      await expect(service.getOrderPreview(ORDER_ID)).rejects.toThrow("Internal DB Error");
    });
  });
});