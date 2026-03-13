/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Pagos y Transacciones (Pruebas Unitarias)
 * Historia de Usuario: HU018 - Selección de método de pago
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { PaymentService } from "@/services/seller/payment/PaymentMethod.service";
import { PaymentStatus } from "@prisma/client";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
  updateStatus: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const ORDER_ID = "order-pay-001";
const PAYMENT_ID = "pay-rec-999";

const mockPaymentResponse = {
  id: PAYMENT_ID,
  order_id: ORDER_ID,
  provider: "PayPal",
  amount: 1500.00,
  status: "pendiente",
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("PaymentService — HU018", () => {
  let service: PaymentService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PaymentService(mockRepository as any);
  });

  // ── registerPaymentMethod ────────────────────────────────────────────────
  describe("registerPaymentMethod()", () => {
    it("debería registrar el método de pago exitosamente cuando los datos son válidos", async () => {
      mockRepository.execute.mockResolvedValue(mockPaymentResponse);

      const result = await service.registerPaymentMethod({
        orderId: ORDER_ID,
        provider: "PayPal",
        amount: 1500.00,
      });

      expect(mockRepository.execute).toHaveBeenCalledWith({
        order_id: ORDER_ID,
        provider: "PayPal",
        amount: 1500.00,
      });
      expect(result.paymentId).toBe(PAYMENT_ID);
      expect(result.status).toBe("pendiente");
    });

    it("debería lanzar error si el proveedor no está en la lista de permitidos", async () => {
      await expect(service.registerPaymentMethod({
        orderId: ORDER_ID,
        provider: "Criptomonedas" as any,
        amount: 100,
      })).rejects.toThrow('El proveedor de pago "Criptomonedas" no está soportado.');
      
      expect(mockRepository.execute).not.toHaveBeenCalled();
    });

    it("debería lanzar error si el monto es cero o negativo", async () => {
      await expect(service.registerPaymentMethod({
        orderId: ORDER_ID,
        provider: "Stripe",
        amount: 0,
      })).rejects.toThrow("El monto del pago debe ser mayor a cero.");
    });

    it("debería propagar errores del repositorio al intentar registrar", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Database error"));

      await expect(service.registerPaymentMethod({
        orderId: ORDER_ID,
        provider: "Stripe",
        amount: 500,
      })).rejects.toThrow("No se pudo registrar el método de pago. Inténtalo de nuevo.");
    });
  });

  // ── processPaymentConfirmation ───────────────────────────────────────────
  describe("processPaymentConfirmation()", () => {
    it("debería actualizar el estado a 'aprobado' cuando la transacción es exitosa", async () => {
      mockRepository.updateStatus.mockResolvedValue({ id: PAYMENT_ID, status: PaymentStatus.aprobado });

      const message = await service.processPaymentConfirmation(PAYMENT_ID, true);

      expect(mockRepository.updateStatus).toHaveBeenCalledWith(PAYMENT_ID, PaymentStatus.aprobado);
      expect(message).toContain("¡Pago confirmado!");
    });

    it("debería actualizar el estado a 'rechazado' cuando la transacción falla", async () => {
      mockRepository.updateStatus.mockResolvedValue({ id: PAYMENT_ID, status: PaymentStatus.rechazado });

      const message = await service.processPaymentConfirmation(PAYMENT_ID, false);

      expect(mockRepository.updateStatus).toHaveBeenCalledWith(PAYMENT_ID, PaymentStatus.rechazado);
      expect(message).toContain("El pago fue rechazado");
    });

    it("debería propagar errores del repositorio al actualizar el estado", async () => {
      mockRepository.updateStatus.mockRejectedValue(new Error("Status update failed"));

      await expect(service.processPaymentConfirmation(PAYMENT_ID, true))
        .rejects.toThrow("Status update failed");
    });
  });
});