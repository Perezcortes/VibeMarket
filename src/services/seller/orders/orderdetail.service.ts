/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Detalle del Pedido
 * Historia de Usuario: US003-C
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

import { OrderDetailPersistenceRepository } from "@/repositories/seller/orders/OrderDetails.repository";

// ─── Tipo inferido desde el repositorio ───────────────────────────────────
type OrderDetail = Awaited<
  ReturnType<typeof OrderDetailPersistenceRepository.findOrderDetailById>
>;

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class OrderDetailService {
  constructor(
    private readonly repository: typeof OrderDetailPersistenceRepository
  ) {}

  /**
   * Obtiene el detalle completo de un pedido: productos, dirección y pago.
   * Valida que el pedido exista antes de devolverlo.
   *
   * @param orderId - ID del pedido a consultar
   * @returns Objeto completo con ítems, dirección, comprador y pagos
   * @throws Error si el orderId es inválido o el pedido no existe
   */
  async getOrderDetail(orderId: string): Promise<NonNullable<OrderDetail>> {
    if (!orderId || orderId.trim() === "") {
      throw new Error("El ID del pedido es requerido.");
    }

    const order = await this.repository.findOrderDetailById(orderId);

    if (!order) {
      throw new Error(`No se encontró el pedido con ID: ${orderId}`);
    }

    return order;
  }

  /**
   * Retorna el resumen de pago de un pedido (monto total, método, estado).
   * Útil para mostrar solo la sección de pagos en la vista de detalle.
   *
   * @param orderId - ID del pedido
   * @returns Arreglo de pagos asociados al pedido
   */
  async getOrderPaymentSummary(orderId: string) {
    if (!orderId || orderId.trim() === "") {
      throw new Error("El ID del pedido es requerido.");
    }

    const order = await this.repository.findOrderDetailById(orderId);

    if (!order) {
      throw new Error(`No se encontró el pedido con ID: ${orderId}`);
    }

    return order.payments ?? [];
  }
}