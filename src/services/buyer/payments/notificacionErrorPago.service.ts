/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Compradores / Pago
 * Historia de Usuario: US012-E: Como comprador, quiero saber si mi pago no se ha realizado,para volver a hacerlo.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 4 de marzo de 2026
 */

import { FailedPaymentRepository } from "@/repositories/buyer/payments/notificacionErrorPago.repository";

// Aquí inicia la lógica de la capa de servicio
export class FailedPaymentService {
  
  /**
   * Registra un intento de pago fallido actualizando su estado a 'rechazado'.
   * @param orderId Identificador del pedido.
   */
  async registerFailedPayment(orderId: string) {
    if (!orderId) {
      throw new Error("Se requiere un ID de pedido válido para registrar el intento de pago fallido.");
    }

    try {
      // Llamamos al repositorio para actualizar el estado del pago a 'rechazado'
      const result = await FailedPaymentRepository.registerFailedAttempt(orderId);
      
      //count indica cuántos registros fueron actualizados, 
      // si es mayor a 0, significa que se encontró el pago 
      // y se actualizó su estado
      if (result.count > 0) {
        return {
          success: true,
          message: "El intento de pago fallido ha sido registrado correctamente."
        };
      } else {
        return {
          success: false,
          message: "No se encontró ningún pago asociado al ID de pedido proporcionado."
        };
      }
    } catch (error) {
      // Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al registrar el intento de pago fallido.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}