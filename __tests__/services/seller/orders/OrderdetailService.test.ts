/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Detalle del Pedido (Pruebas Unitarias)
 * Historia de Usuario: US003-C: Detalle del Pedido
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari Ramirez
 * FECHA: 11 de marzo de 2026
 */

import { OrderDetailService } from "@/services/seller/orders/orderdetail.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  findOrderDetailById: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const ORDER_ID = "order-detail-001";

const mockOrderDetail = {
  id: ORDER_ID,
  status: "pendiente",
  buyer: {
    full_name: "María García",
    email: "maria@mail.com",
    phone: "5512345678",
  },
  address: {
    street: "Calle Moctezuma 42",
    city: "CDMX",
    zip: "06600",
  },
  items: [
    {
      id: "item-1",
      quantity: 3,
      product: {
        id: "prod-1",
        name: "Sudadera",
        price: 450,
        seller_id: "seller-001",
      },
    },
  ],
  payments: [
    {
      id: "pay-1",
      amount: 1350,
      method: "CARD",
      status: "aprobado",
    },
  ],
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("OrderDetailService — US003-C", () => {
  let service: OrderDetailService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderDetailService(mockRepository as any);
  });

  // ── getOrderDetail ───────────────────────────────────────────────────────
  describe("getOrderDetail()", () => {
    it("debería retornar el detalle completo del pedido", async () => {
      mockRepository.findOrderDetailById.mockResolvedValue(mockOrderDetail);

      const result = await service.getOrderDetail(ORDER_ID);

      expect(mockRepository.findOrderDetailById).toHaveBeenCalledWith(ORDER_ID);
      expect(result.id).toBe(ORDER_ID);
      expect(result.buyer.full_name).toBe("María García");
      expect(result.items).toHaveLength(1);
      expect(result.payments).toHaveLength(1);
    });

    it("debería lanzar error si el pedido no existe (null)", async () => {
      mockRepository.findOrderDetailById.mockResolvedValue(null);

      await expect(service.getOrderDetail(ORDER_ID)).rejects.toThrow(
        `No se encontró el pedido con ID: ${ORDER_ID}`
      );
    });

    it("debería lanzar error si orderId está vacío", async () => {
      await expect(service.getOrderDetail("")).rejects.toThrow(
        "El ID del pedido es requerido."
      );
      expect(mockRepository.findOrderDetailById).not.toHaveBeenCalled();
    });

    it("debería lanzar error si orderId es solo espacios", async () => {
      await expect(service.getOrderDetail("   ")).rejects.toThrow(
        "El ID del pedido es requerido."
      );
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.findOrderDetailById.mockRejectedValue(
        new Error("Timeout de base de datos")
      );

      await expect(service.getOrderDetail(ORDER_ID)).rejects.toThrow(
        "Timeout de base de datos"
      );
    });
  });

  // ── getOrderPaymentSummary ───────────────────────────────────────────────
  describe("getOrderPaymentSummary()", () => {
    it("debería retornar los pagos del pedido", async () => {
      mockRepository.findOrderDetailById.mockResolvedValue(mockOrderDetail);

      const payments = await service.getOrderPaymentSummary(ORDER_ID);

      expect(payments).toHaveLength(1);
      expect(payments[0].amount).toBe(1350);
      expect(payments[0].status).toBe("aprobado");
    });

    it("debería retornar arreglo vacío si el pedido no tiene pagos", async () => {
      mockRepository.findOrderDetailById.mockResolvedValue({
        ...mockOrderDetail,
        payments: [],
      });

      const payments = await service.getOrderPaymentSummary(ORDER_ID);

      expect(payments).toEqual([]);
    });

    it("debería retornar arreglo vacío si payments es undefined", async () => {
      mockRepository.findOrderDetailById.mockResolvedValue({
        ...mockOrderDetail,
        payments: undefined,
      });

      const payments = await service.getOrderPaymentSummary(ORDER_ID);

      expect(payments).toEqual([]);
    });

    it("debería lanzar error si el pedido no existe", async () => {
      mockRepository.findOrderDetailById.mockResolvedValue(null);

      await expect(service.getOrderPaymentSummary(ORDER_ID)).rejects.toThrow(
        `No se encontró el pedido con ID: ${ORDER_ID}`
      );
    });

    it("debería lanzar error si orderId está vacío", async () => {
      await expect(service.getOrderPaymentSummary("")).rejects.toThrow(
        "El ID del pedido es requerido."
      );
    });
  });
});