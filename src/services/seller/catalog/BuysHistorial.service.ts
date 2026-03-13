/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Control de Gastos y Compras
 * Historia de Usuario: HU008 - Historial de compras para control de gastos
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { PurchaseHistoryRepository } from "@/repositories/seller/catalog/BuysHistorial.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface OrderItemDTO {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string | null;
}

export interface PurchaseHistoryDTO {
  id: string;
  total: number;
  status: string;
  purchaseDate: Date | null;
  items: OrderItemDTO[];
  paymentMethod: string;
}

export interface ExpenseSummaryDTO {
  totalSpent: number;
  totalOrders: number;
  averageTicket: number;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class PurchaseHistoryService {
  constructor(
    private readonly repository: typeof PurchaseHistoryRepository
  ) {}

  /**
   * HU008 — Obtiene el historial detallado de compras.
   * * @param userId - ID del comprador
   */
  async getFullHistory(userId: string): Promise<PurchaseHistoryDTO[]> {
    const orders = await this.repository.execute(userId);

    return orders.map((order) => {
      // Mapeamos los items de la orden y convertimos precios
      const mappedItems: OrderItemDTO[] = order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        subtotal: item.quantity * Number(item.unit_price),
        imageUrl: item.product.images[0]?.url || null,
      }));

      // Obtenemos el método de pago (si existe)
      const lastPayment = order.payments[0];

      return {
        id: order.id,
        total: Number(order.total_amount),
        status: order.status,
        // Usamos la fecha del historial más reciente como fecha de compra o el pago
        purchaseDate: lastPayment?.created_at || order.history[0]?.changed_at || null,
        items: mappedItems,
        paymentMethod: lastPayment?.provider || "No especificado",
      };
    });
  }

  /**
   * HU008 — Genera un resumen de gastos para el control financiero.
   * * @param userId - ID del comprador
   */
  async getUserExpenseSummary(userId: string): Promise<ExpenseSummaryDTO> {
    const stats = await this.repository.getExpenseSummary(userId);

    const totalSpent = Number(stats._sum.total_amount || 0);
    const totalOrders = stats._count.id;

    return {
      totalSpent: totalSpent,
      totalOrders: totalOrders,
      // Calculamos el ticket promedio
      averageTicket: totalOrders > 0 ? totalSpent / totalOrders : 0
    };
  }
}