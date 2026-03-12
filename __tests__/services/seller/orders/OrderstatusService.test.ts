/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Actualización de Estado de Pedido (Pruebas Unitarias)
 * Historia de Usuario: US003-B: Actualización de Estado de Pedido
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari Ramirez
 * FECHA: 11 de marzo de 2026
 */
import { OrderStatusService } from "@/services/seller/orders/Orderstatus.service";
import { OrderStatus } from "@prisma/client";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  updateStatus: jest.fn(),
  createStatusHistory: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const ORDER_ID  = "order-xyz-001";
const SELLER_ID = "seller-abc-123";

const mockUpdatedOrder = {
  id: ORDER_ID,
  status: OrderStatus.enviado,
  buyer_id: "buyer-001",
};

const mockHistoryRecord = {
  id: "history-001",
  order_id: ORDER_ID,
  status: OrderStatus.enviado,
  changed_by: SELLER_ID,
  created_at: new Date(),
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("OrderStatusService — US003-B", () => {
  let service: OrderStatusService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderStatusService(mockRepository as any);
  });

  // ── changeOrderStatus ────────────────────────────────────────────────────
  describe("changeOrderStatus()", () => {
    it("debería actualizar el estado y crear el registro de historial", async () => {
      mockRepository.updateStatus.mockResolvedValue(mockUpdatedOrder);
      mockRepository.createStatusHistory.mockResolvedValue(mockHistoryRecord);

      const result = await service.changeOrderStatus(
        ORDER_ID,
        OrderStatus.enviado,
        SELLER_ID
      );

      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        ORDER_ID,
        OrderStatus.enviado
      );
      expect(mockRepository.createStatusHistory).toHaveBeenCalledWith(
        ORDER_ID,
        OrderStatus.enviado,
        SELLER_ID
      );
      expect(result.status).toBe(OrderStatus.enviado);
    });

    it("debería llamar updateStatus ANTES de createStatusHistory", async () => {
      const callOrder: string[] = [];
      mockRepository.updateStatus.mockImplementation(async () => {
        callOrder.push("updateStatus");
        return mockUpdatedOrder;
      });
      mockRepository.createStatusHistory.mockImplementation(async () => {
        callOrder.push("createStatusHistory");
        return mockHistoryRecord;
      });

      await service.changeOrderStatus(ORDER_ID, OrderStatus.entregado, SELLER_ID);

      expect(callOrder).toEqual(["updateStatus", "createStatusHistory"]);
    });

    it("debería lanzar error si orderId está vacío", async () => {
      await expect(
        service.changeOrderStatus("", OrderStatus.pendiente, SELLER_ID)
      ).rejects.toThrow("El ID del pedido es requerido.");

      expect(mockRepository.updateStatus).not.toHaveBeenCalled();
    });

    it("debería lanzar error si sellerId está vacío", async () => {
      await expect(
        service.changeOrderStatus(ORDER_ID, OrderStatus.pendiente, "")
      ).rejects.toThrow("El ID del vendedor es requerido.");
    });

    it("debería lanzar error si newStatus es nulo", async () => {
      await expect(
        service.changeOrderStatus(ORDER_ID, null as any, SELLER_ID)
      ).rejects.toThrow("El nuevo estado es requerido.");
    });

    it("debería propagar error si updateStatus falla", async () => {
      mockRepository.updateStatus.mockRejectedValue(new Error("DB error"));

      await expect(
        service.changeOrderStatus(ORDER_ID, OrderStatus.enviado, SELLER_ID)
      ).rejects.toThrow("DB error");

      // Si updateStatus falla, NO debería llamarse createStatusHistory
      expect(mockRepository.createStatusHistory).not.toHaveBeenCalled();
    });
  });

  // ── logStatusHistory ─────────────────────────────────────────────────────
  describe("logStatusHistory()", () => {
    it("debería insertar el registro de historial correctamente", async () => {
      mockRepository.createStatusHistory.mockResolvedValue(mockHistoryRecord);

      const result = await service.logStatusHistory(
        ORDER_ID,
        OrderStatus.pendiente,
        SELLER_ID
      );

      expect(mockRepository.createStatusHistory).toHaveBeenCalledWith(
        ORDER_ID,
        OrderStatus.pendiente,
        SELLER_ID
      );
      expect(result.order_id).toBe(ORDER_ID);
    });

    it("debería lanzar error si orderId está vacío", async () => {
      await expect(
        service.logStatusHistory("", OrderStatus.pendiente, SELLER_ID)
      ).rejects.toThrow("El ID del pedido es requerido.");
    });

    it("debería lanzar error si sellerId está vacío", async () => {
      await expect(
        service.logStatusHistory(ORDER_ID, OrderStatus.pendiente, "  ")
      ).rejects.toThrow("El ID del vendedor es requerido.");
    });
  });
});