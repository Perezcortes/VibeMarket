/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Pagos y Post-venta
 * Historia de Usuario: HU020 - Confirmación de pago exitoso
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { PaymentConfirmationRepository } from "@/repositories/seller/payment/SeccessfulPayment.repository";
import { PaymentStatus } from "@prisma/client";

// ─── DTO de salida (Recibo de confirmación) ────────────────────────────────
export interface PaymentReceiptDTO {
  orderId: string;
  transactionId: string;
  buyerName: string;
  email: string;
  totalPaid: number;
  status: string;
  confirmationDate: Date;
  message: string;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class PaymentConfirmationService {
  constructor(
    private readonly repository: typeof PaymentConfirmationRepository
  ) {}

  /**
   * HU020 — Confirma el éxito del pago y genera el recibo para el comprador.
   * @param orderId - ID de la orden pagada
   * @param paymentId - ID del registro de pago procesado
   */
  async processSuccessfulPayment(orderId: string, paymentId: string): Promise<PaymentReceiptDTO> {
    if (!orderId || !paymentId) {
      throw new Error("Se requieren los IDs de orden y pago para confirmar la transacción.");
    }

    try {
      // Ejecutamos la transacción en el repositorio (Pago 'aprobado' + Orden 'pagado')
      const result = await this.repository.confirmSuccess(orderId, paymentId);

      const { order, payment } = result;

      return {
        orderId: order.id,
        transactionId: payment.id,
        buyerName: order.buyer.full_name,
        email: order.buyer.email,
        totalPaid: Number(order.total_amount),
        status: order.status,
        confirmationDate: new Date(),
        message: `¡Gracias por tu compra, ${order.buyer.full_name}! Tu pago ha sido confirmado exitosamente.`
      };
    } catch (error) {
      console.error("Error crítico al confirmar pago:", error);
      throw new Error("Ocurrió un problema al sincronizar tu pago. Por favor, contacta a soporte con tu ID de orden.");
    }
  }
}