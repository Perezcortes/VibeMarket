/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Pagos y Post-venta (Pruebas Unitarias)
 * Historia de Usuario: HU020 - Confirmación de pago exitoso
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { PaymentConfirmationService } from "@/services/seller/payment/SeccessfulPayment.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  confirmSuccess: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const ORDER_ID = "ord-success-123";
const PAYMENT_ID = "pay-success-456";

const mockTransactionResult = {
  order: {
    id: ORDER_ID,
    total_amount: 2500.75,
    status: "pagado",
    buyer: {
      full_name: "Yamil Alejandro",
      email: "yamil@mail.com",
    },
  },
  payment: {
    id: PAYMENT_ID,
    status: "aprobado",
  },
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("PaymentConfirmationService — HU020", () => {
  let service: PaymentConfirmationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PaymentConfirmationService(mockRepository as any);
  });

  // ── processSuccessfulPayment ─────────────────────────────────────────────
  describe("processSuccessfulPayment()", () => {
    it("debería retornar un recibo detallado cuando la transacción es exitosa", async () => {
      mockRepository.confirmSuccess.mockResolvedValue(mockTransactionResult);

      const result = await service.processSuccessfulPayment(ORDER_ID, PAYMENT_ID);

      expect(mockRepository.confirmSuccess).toHaveBeenCalledWith(ORDER_ID, PAYMENT_ID);
      
      // Validación de datos del comprador
      expect(result.buyerName).toBe("Yamil Alejandro");
      expect(result.email).toBe("yamil@mail.com");
      
      // Validación de datos financieros
      expect(result.totalPaid).toBe(2500.75);
      expect(typeof result.totalPaid).toBe("number");
      
      // Validación de IDs y Mensaje
      expect(result.orderId).toBe(ORDER_ID);
      expect(result.transactionId).toBe(PAYMENT_ID);
      expect(result.message).toContain("¡Gracias por tu compra, Yamil Alejandro!");
    });

    it("debería lanzar error si falta el orderId o el paymentId", async () => {
      await expect(service.processSuccessfulPayment("", PAYMENT_ID))
        .rejects.toThrow("Se requieren los IDs de orden y pago para confirmar la transacción.");

      await expect(service.processSuccessfulPayment(ORDER_ID, ""))
        .rejects.toThrow("Se requieren los IDs de orden y pago para confirmar la transacción.");
    });

    it("debería manejar errores de sincronización con un mensaje amigable", async () => {
      mockRepository.confirmSuccess.mockRejectedValue(new Error("Deadlock detected"));

      await expect(service.processSuccessfulPayment(ORDER_ID, PAYMENT_ID)).rejects.toThrow(
        "Ocurrió un problema al sincronizar tu pago. Por favor, contacta a soporte con tu ID de orden."
      );
    });

    it("debería incluir la fecha actual en el recibo de confirmación", async () => {
      mockRepository.confirmSuccess.mockResolvedValue(mockTransactionResult);

      const result = await service.processSuccessfulPayment(ORDER_ID, PAYMENT_ID);

      expect(result.confirmationDate).toBeInstanceOf(Date);
      // Verificamos que la fecha sea reciente (no más de 10 segundos de diferencia)
      const now = new Date();
      expect(now.getTime() - result.confirmationDate.getTime()).toBeLessThan(10000);
    });

    it("debería convertir montos Decimal de Prisma (strings) a number correctamente", async () => {
      mockRepository.confirmSuccess.mockResolvedValue({
        ...mockTransactionResult,
        order: {
          ...mockTransactionResult.order,
          total_amount: "999.99"
        }
      });

      const result = await service.processSuccessfulPayment(ORDER_ID, PAYMENT_ID);

      expect(result.totalPaid).toBe(999.99);
      expect(typeof result.totalPaid).toBe("number");
    });

    it("debería propagar errores de lógica interna del repositorio", async () => {
      mockRepository.confirmSuccess.mockRejectedValue(new Error("Database connection lost"));

      await expect(service.processSuccessfulPayment(ORDER_ID, PAYMENT_ID)).rejects.toThrow(
        "Ocurrió un problema al sincronizar tu pago."
      );
    });
  });
});