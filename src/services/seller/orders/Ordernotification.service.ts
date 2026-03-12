/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Notificación de Cambio de Estado
 * Historia de Usuario: US003-D
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

import { OrderNotificationPersistenceRepository } from "@/repositories/seller/orders/OrderNotification.repository";

// ─── Tipo inferido del repositorio ────────────────────────────────────────
type NotificationData = Awaited<
  ReturnType<typeof OrderNotificationPersistenceRepository.getNotificationData>
>;

// ─── Interfaz del resultado de notificación ───────────────────────────────
export interface NotificationResult {
  success: boolean;
  recipient: string;
  message: string;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class OrderNotificationService {
  constructor(
    private readonly repository: typeof OrderNotificationPersistenceRepository
  ) {}

  /**
   * Prepara y "envía" la notificación al comprador cuando el estado cambia.
   * En esta capa se construye el mensaje; el canal de envío (email/SMS)
   * se delega a la capa de infraestructura.
   *
   * @param orderId - ID del pedido que cambió de estado
   * @returns Resultado con destinatario y mensaje generado
   * @throws Error si el pedido no existe o los datos son inválidos
   */
  async notifyBuyer(orderId: string): Promise<NotificationResult> {
    if (!orderId || orderId.trim() === "") {
      throw new Error("El ID del pedido es requerido.");
    }

    const data = await this.repository.getNotificationData(orderId);

    if (!data) {
      throw new Error(`No se encontró el pedido con ID: ${orderId}`);
    }

    if (!data.buyer?.email) {
      throw new Error("El comprador no tiene email registrado.");
    }

    const message = this.buildMessage(data);

    // En producción aquí se llamaría al servicio de email/SMS
    // emailService.send(data.buyer.email, message);

    return {
      success: true,
      recipient: data.buyer.email,
      message,
    };
  }

  /**
   * Construye el texto del mensaje de notificación según el estado.
   *
   * @param data - Datos mínimos del pedido y comprador
   * @returns Cadena con el mensaje personalizado
   */
  buildMessage(data: NonNullable<NotificationData>): string {
    const statusMessages: Record<string, string> = {
      PENDING:   "Tu pedido ha sido recibido y está en espera de procesamiento.",
      SHIPPED:   "¡Tu pedido está en camino! Pronto llegará a tu domicilio.",
      DELIVERED: "Tu pedido ha sido entregado. ¡Esperamos que lo disfrutes!",
      CANCELLED: "Tu pedido ha sido cancelado. Contáctanos si tienes dudas.",
    };

    const statusText =
      statusMessages[data.status] ?? `Tu pedido cambió al estado: ${data.status}`;

    return `Hola ${data.buyer.full_name}, ${statusText} (Pedido #${data.id})`;
  }
}