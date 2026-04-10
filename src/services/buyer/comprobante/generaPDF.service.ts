/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Compradores / Pago
 * Historia de Usuario: US012-F: Como comprador, quiero descargar mi 
 * comprobante de pago en pdf,para tenerlo de prueba.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 5 de marzo de 2026
 */

import { ReceiptRepository } from "@/repositories/buyer/comprobante/generaPDF.repository";

// Aquí inicia la lógica de la capa de servicio
export class ComprobantePDFService {
  
  /**
   * Genera un comprobante de pago en formato PDF para un pedido específico.
   * @param orderId Identificador del pedido.
   */
  async generateComprobantePDF(orderId: string) {
    if (!orderId) {
      throw new Error("Se requiere un ID de pedido válido para generar el comprobante PDF.");
    }

    try {
        //buffer es un tipo de dato que representa una secuencia de bytes,
        // en este caso, el contenido del PDF generado se almacena en un buffer para su posterior uso o descarga
      // Llamamos al repositorio para generar el PDF del comprobante de pago
      const pdfBuffer = await ReceiptRepository.getOrderDetailsForReceipt(orderId);
      
      return {
        success: true,
        message: "El comprobante PDF ha sido generado correctamente.",
        //nos inventaomos la palabra data para indicar que el contenido del PDF generado se encuentra en el buffer
        data: pdfBuffer
      };
    } catch (error) {
      // Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al generar el comprobante PDF.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}  