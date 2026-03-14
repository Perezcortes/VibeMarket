/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Monitoreo de Pedidos Recibidos
 * Historia de Usuario: US003-A
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

import { OrderMonitoringRepository } from "@/repositories/seller/orders/OrderMonitoring.repository";

// ─── Tipos de retorno inferidos desde Prisma ───────────────────────────────
type ReceivedOrder = Awaited<
  ReturnType<typeof OrderMonitoringRepository.findReceivedOrders>
>[number];

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class OrderMonitoringService {
  constructor(
    private readonly repository: typeof OrderMonitoringRepository
  ) {}

  /**
   * Obtiene todos los pedidos recibidos de un vendedor.
   * Valida que el sellerId no sea vacío antes de consultar.
   *
   * @param sellerId - ID del vendedor autenticado
   * @returns Lista de pedidos filtrados al vendedor
   * @throws Error si el sellerId es inválido
   */
  async getReceivedOrders(sellerId: string): Promise<ReceivedOrder[]> {
    if (!sellerId || sellerId.trim() === "") {
      throw new Error("El ID del vendedor es requerido.");
    }

    const orders = await this.repository.findReceivedOrders(sellerId);

    return orders;
  }

  /**
   * Verifica si el vendedor tiene pedidos pendientes.
   *
   * @param sellerId - ID del vendedor
   * @returns true si existen pedidos con status PENDING
   */
  async hasPendingOrders(sellerId: string): Promise<boolean> {
    if (!sellerId || sellerId.trim() === "") {
      throw new Error("El ID del vendedor es requerido.");
    }

    const orders = await this.repository.findReceivedOrders(sellerId);
    return orders.some((order) => order.status === "pendiente");
  }
}