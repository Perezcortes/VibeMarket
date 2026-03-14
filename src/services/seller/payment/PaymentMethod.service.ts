/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Pagos y Transacciones
 * Historia de Usuario: HU018 - Selección de método de pago
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { PaymentMethodRepository } from "@/repositories/seller/payment/PaymentMethod.repository";
import { PaymentStatus } from "@prisma/client";

// ─── DTO de entrada ────────────────────────────────────────────────────────
export interface SelectPaymentDTO {
  orderId: string;
  provider: "PayPal" | "Stripe" | "Tarjeta de Crédito" | "Transferencia";
  amount: number;
}

// ─── DTO de salida ─────────────────────────────────────────────────────────
export interface PaymentResponseDTO {
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  message: string;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class PaymentService {
  constructor(
    private readonly repository: typeof PaymentMethodRepository
  ) {}

  /**
   * HU018 — Registra el método de pago seleccionado por el usuario.
   * @param data - Información del pago (Orden, Proveedor y Monto)
   */
  async registerPaymentMethod(data: SelectPaymentDTO): Promise<PaymentResponseDTO> {
    
    // ── Validaciones de Regla de Negocio ──────────────────────────────────
    const allowedProviders = ["PayPal", "Stripe", "Tarjeta de Crédito", "Transferencia"];
    
    if (!allowedProviders.includes(data.provider)) {
      throw new Error(`El proveedor de pago "${data.provider}" no está soportado.`);
    }

    if (data.amount <= 0) {
      throw new Error("El monto del pago debe ser mayor a cero.");
    }

    // ── Persistencia del Intento de Pago ──────────────────────────────────
    try {
      const payment = await this.repository.execute({
        order_id: data.orderId,
        provider: data.provider,
        amount: data.amount,
      });

      return {
        paymentId: payment.id,
        orderId: payment.order_id,
        status: payment.status as PaymentStatus,
        message: `Método de pago ${data.provider} seleccionado con éxito. Esperando confirmación.`
      };
    } catch (error) {
      console.error("Error al registrar método de pago:", error);
      throw new Error("No se pudo registrar el método de pago. Inténtalo de nuevo.");
    }
  }

/**
   * HU018 — Simula o procesa la confirmación de la pasarela de pago.
   * @param paymentId - ID del registro de pago
   * @param success - Si la pasarela aprobó la transacción
   */
  async processPaymentConfirmation(paymentId: string, success: boolean): Promise<string> {
    
    // Ajustado según los valores reales de tu Enum: 'aprobado' y 'rechazado'
    const finalStatus: PaymentStatus = success 
      ? PaymentStatus.aprobado 
      : PaymentStatus.rechazado;
    
    await this.repository.updateStatus(paymentId, finalStatus);

    return success 
      ? "¡Pago confirmado! Tu orden será procesada pronto." 
      : "El pago fue rechazado. Por favor, intenta con otro método.";
  }
}