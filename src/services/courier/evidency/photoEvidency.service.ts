/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Logística / Reparto
 * Historia de Usuario: US016-F: Como repartidor, quiero subir una imagen de prueba
 *  del paquete entregado,para evitar problemas de entrega.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 8 de marzo de 2026
 */

// ¡Ajusta esta ruta a donde tengas tu repository!
import { PhotoEvidencyRepository } from "@/repositories/courier/evidency/photoEvidency.repository";

export class PhotoEvidencyService {
  
  /**
   * Sube la evidencia fotográfica (Buffer) de una entrega para un pedido específico.
   * @param orderId Identificador del pedido (UUID).
   * @param imageBuffer Archivo de la imagen convertido en Buffer.
   */
  async uploadEvidency(orderId: string, imageBuffer: Buffer) {
    // 1. Validar el ID del pedido
    if (!orderId) {
      throw new Error("Se requiere un ID de pedido válido para subir la evidencia.");
    }
    
    // 2. Validar que la imagen realmente sea un Buffer
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      throw new Error("Se requiere un archivo de imagen válido (formato Buffer).");
    }

    try {
      // 3. Llamar al repositorio
      const updatedOrder = await PhotoEvidencyRepository.uploadEvidency(orderId, imageBuffer);
      
      return {
        success: true,
        message: `Evidencia fotográfica subida correctamente para el pedido ${orderId}.`,
        data: updatedOrder
      };
    } catch (error) {
      // 4. Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al subir la evidencia fotográfica.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}