/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Checkout y Confirmación
 * Historia de Usuario: HU019 - Confirmación de orden antes del pago
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { OrderConfirmationRepository } from "@/repositories/seller/payment/ConfirmOrder.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface OrderSummaryDTO {
  orderId: string;
  total: number;
  status: string;
  shippingAddress: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    imageUrl: string | null;
  }[];
  paymentMethod: {
    provider: string;
    status: string;
  } | null;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class OrderConfirmationService {
  constructor(
    private readonly repository: typeof OrderConfirmationRepository
  ) {}

  /**
   * HU019 — Genera un resumen estructurado de la orden para revisión final.
   * @param orderId - ID de la orden generada
   * @returns Resumen detallado de la orden
   * @throws Error si la orden no existe
   */
  async getOrderPreview(orderId: string): Promise<OrderSummaryDTO> {
    const order = await this.repository.getOrderSummary(orderId);

    if (!order) {
      throw new Error("La orden solicitada no existe.");
    }

    // ── Formateo de la dirección de envío ─────────────────────────────────
    const addr = order.address;
    const fullAddress = `${addr.street}, ${addr.city}, ${addr.state}, ${addr.postal_code}, ${addr.country}`;

    // ── Transformación de items y cálculo de subtotales ────────────────────
    const items = order.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.unit_price),
      subtotal: item.quantity * Number(item.unit_price),
      imageUrl: item.product.images[0]?.url || null,
    }));

    // ── Información del pago ─────────────────────────────────────────────
    const payment = order.payments[0] ? {
      provider: order.payments[0].provider,
      status: order.payments[0].status
    } : null;

    return {
      orderId: order.id,
      total: Number(order.total_amount),
      status: order.status,
      shippingAddress: fullAddress,
      items: items,
      paymentMethod: payment
    };
  }
}