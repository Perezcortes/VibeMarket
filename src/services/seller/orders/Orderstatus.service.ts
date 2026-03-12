/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Actualización de Estado de Pedido
 * Historia de Usuario: US003-B
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

import { OrderStatus } from "@prisma/client";
import { OrderPersistenceRepository } from "@/repositories/seller/orders/Orderstatus.repository";

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class OrderStatusService {
  constructor(
    private readonly repository: typeof OrderPersistenceRepository
  ) {}

  /**
   * Cambia el estado de un pedido y registra el historial.
   * Ejecuta ambas operaciones en secuencia; si una falla, lanza el error.
   *
   * @param orderId  - ID del pedido a actualizar
   * @param newStatus - Nuevo estado a asignar (OrderStatus enum)
   * @param sellerId  - ID del vendedor que realiza el cambio
   * @returns El pedido actualizado
   * @throws Error si algún parámetro es inválido
   */
  async changeOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    sellerId: string
  ) {
    if (!orderId || orderId.trim() === "") {
      throw new Error("El ID del pedido es requerido.");
    }
    if (!sellerId || sellerId.trim() === "") {
      throw new Error("El ID del vendedor es requerido.");
    }
    if (!newStatus) {
      throw new Error("El nuevo estado es requerido.");
    }

    // 1. Actualizar el estado actual del pedido
    const updatedOrder = await this.repository.updateStatus(orderId, newStatus);

    // 2. Registrar en el historial de cambios
    await this.repository.createStatusHistory(orderId, newStatus, sellerId);

    return updatedOrder;
  }

  /**
   * Registra únicamente el historial sin cambiar el estado del pedido.
   * Útil para auditoría manual.
   */
  async logStatusHistory(
    orderId: string,
    status: OrderStatus,
    sellerId: string
  ) {
    if (!orderId || orderId.trim() === "") {
      throw new Error("El ID del pedido es requerido.");
    }
    if (!sellerId || sellerId.trim() === "") {
      throw new Error("El ID del vendedor es requerido.");
    }

    return this.repository.createStatusHistory(orderId, status, sellerId);
  }
}