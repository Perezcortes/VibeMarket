/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Compradores / Pago
 * Historia de Usuario: US012-D: Como comprador, quiero que la pagina me guíe si mi pago no se ha realizado, 
 * para no perder el progreso de mi compra.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 4 de marzo de 2026
 */

import { PaymentStatusRepository } from "@/repositories/buyer/payments/errorPago.repository";

// Aquí inicia la lógica de la capa de servicio
export class PaymentErrorService {
  
  /**
   * Verifica el estado del pago para una orden específica y guía al comprador en caso de error.
   * @param orderId Identificador del pedido.
   */
  async checkPaymentStatus(orderId: string) {
    if (!orderId) {
      throw new Error("Se requiere un ID de pedido válido para verificar el estado del pago.");
    }

    try {
      // 1. Consulta a la capa de persistencia
      const paymentStatus = await PaymentStatusRepository.getPaymentStatusByOrderId(orderId);

      // 2. Lógica de Negocio: Guía al comprador según el estado del pago
      switch (paymentStatus?.status) {
        case 'aprobado':
          return {
            status: "APROBADO",
            message: "¡Tu pago ha sido aprobado! Gracias por tu compra."
          };
        case 'pendiente':
          return {
            status: "PENDIENTE",
            message: "Tu pago está pendiente de procesamiento."
          };
        case 'rechazado':
          return {
            status: "RECHAZADO",
            message: "Tu pago ha sido rechazado. Por favor, intenta con otro método de pago o contacta a soporte.",
            action: "RETRY_PAYMENT", 
            redirectUrl: "/checkout/payment-methods", // URL a la que se redirigirá al comprador para intentar el pago nuevamente
            savedProgress: true // Le avisamos que su carrito sigue a salvo
          };
        case 'reembolsado':
          return {
            status: "REEMBOLSADO",
            message: "Tu pago ha sido reembolsado. Si tienes preguntas, contacta a soporte."
          };
        default:
          return {
            status: "DESCONOCIDO",
            message: "No se pudo determinar el estado de tu pago. Por favor, contacta a soporte para más información."
          };
      }

    } catch (error) {
      console.error(`[PaymentErrorService Error]: Falló la verificación del estado del pago para el pedido ${orderId}`, error);
      
      throw new Error(
        error instanceof Error 
          ? `Error en verificación de estado de pago: ${error.message}` 
          : "Error interno al verificar el estado del pago."
      );
    }
  }
}

// Exportamos
export const paymentErrorService = new PaymentErrorService();