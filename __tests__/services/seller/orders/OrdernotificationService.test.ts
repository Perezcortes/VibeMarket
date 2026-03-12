/**
 * PRUEBAS UNITARIAS — US003-D
 * Módulo: Notificación de Cambio de Estado
 * COPILOTO (XP Pair): Ariadna Ramirez
 *
 * Ejecutar: npx jest OrderNotification.service.test.ts
 */

import { OrderNotificationService } from "@/services/seller/orders/Ordernotification.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  getNotificationData: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const ORDER_ID = "order-notif-001";

const mockNotifData = {
  id: ORDER_ID,
  status: "SHIPPED",
  buyer: {
    full_name: "Luis Herrera",
    email: "luis@mail.com",
  },
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("OrderNotificationService — US003-D", () => {
  let service: OrderNotificationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderNotificationService(mockRepository as any);
  });

  // ── notifyBuyer ──────────────────────────────────────────────────────────
  describe("notifyBuyer()", () => {
    it("debería retornar resultado exitoso con destinatario y mensaje", async () => {
      mockRepository.getNotificationData.mockResolvedValue(mockNotifData);

      const result = await service.notifyBuyer(ORDER_ID);

      expect(result.success).toBe(true);
      expect(result.recipient).toBe("luis@mail.com");
      expect(result.message).toContain("Luis Herrera");
      expect(result.message).toContain(ORDER_ID);
    });

    it("debería llamar al repositorio con el orderId correcto", async () => {
      mockRepository.getNotificationData.mockResolvedValue(mockNotifData);

      await service.notifyBuyer(ORDER_ID);

      expect(mockRepository.getNotificationData).toHaveBeenCalledWith(ORDER_ID);
    });

    it("debería lanzar error si el pedido no existe (null)", async () => {
      mockRepository.getNotificationData.mockResolvedValue(null);

      await expect(service.notifyBuyer(ORDER_ID)).rejects.toThrow(
        `No se encontró el pedido con ID: ${ORDER_ID}`
      );
    });

    it("debería lanzar error si orderId está vacío", async () => {
      await expect(service.notifyBuyer("")).rejects.toThrow(
        "El ID del pedido es requerido."
      );
      expect(mockRepository.getNotificationData).not.toHaveBeenCalled();
    });

    it("debería lanzar error si el comprador no tiene email", async () => {
      mockRepository.getNotificationData.mockResolvedValue({
        ...mockNotifData,
        buyer: { full_name: "Sin Email", email: "" },
      });

      await expect(service.notifyBuyer(ORDER_ID)).rejects.toThrow(
        "El comprador no tiene email registrado."
      );
    });

    it("debería propagar errores del repositorio", async () => {
      mockRepository.getNotificationData.mockRejectedValue(
        new Error("Error de conexión")
      );

      await expect(service.notifyBuyer(ORDER_ID)).rejects.toThrow(
        "Error de conexión"
      );
    });
  });

  // ── buildMessage ─────────────────────────────────────────────────────────
  describe("buildMessage()", () => {
    it("debería generar mensaje correcto para estado SHIPPED", () => {
      const msg = service.buildMessage(mockNotifData as any);

      expect(msg).toBe(
        `Hola Luis Herrera, ¡Tu pedido está en camino! Pronto llegará a tu domicilio. (Pedido #${ORDER_ID})`
      );
    });

    it("debería generar mensaje correcto para estado PENDING", () => {
      const data = { ...mockNotifData, status: "PENDING" };
      const msg = service.buildMessage(data as any);

      expect(msg).toContain("en espera de procesamiento");
    });

    it("debería generar mensaje correcto para estado DELIVERED", () => {
      const data = { ...mockNotifData, status: "DELIVERED" };
      const msg = service.buildMessage(data as any);

      expect(msg).toContain("ha sido entregado");
    });

    it("debería generar mensaje correcto para estado CANCELLED", () => {
      const data = { ...mockNotifData, status: "CANCELLED" };
      const msg = service.buildMessage(data as any);

      expect(msg).toContain("ha sido cancelado");
    });

    it("debería generar mensaje genérico para estado desconocido", () => {
      const data = { ...mockNotifData, status: "UNKNOWN_STATE" };
      const msg = service.buildMessage(data as any);

      expect(msg).toContain("cambió al estado: UNKNOWN_STATE");
    });
  });
});