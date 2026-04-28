/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Capa de Presentación: Order Presenter Unificado (Next.js App Router)
 * Historias de Usuario: US003-A, US003-B, US003-C, US003-D
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2026-04-09
 */

import { NextResponse } from "next/server";
import { OrderMonitoringService } from "@/services/seller/orders/Ordermonitoring.service";
import { OrderStatusService } from "@/services/seller/orders/Orderstatus.service";
import { OrderDetailService } from "@/services/seller/orders/orderdetail.service";
import { OrderNotificationService } from "@/services/seller/orders/Ordernotification.service";
import { OrderStatus } from "@prisma/client";

export class OrderPresenter {
  constructor(
    private readonly monitoringService: OrderMonitoringService,
    private readonly statusService: OrderStatusService,
    private readonly detailService: OrderDetailService,
    private readonly notificationService: OrderNotificationService
  ) {}

  // ─── US003-A: Monitoreo de Pedidos ───────────────────────────────────────

  async getReceivedOrders(sellerId: string): Promise<NextResponse> {
    try {
      const orders = await this.monitoringService.getReceivedOrders(sellerId);
      return NextResponse.json({ success: true, data: orders }, { status: 200 });
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async checkPendingOrders(sellerId: string): Promise<NextResponse> {
    try {
      const hasPending = await this.monitoringService.hasPendingOrders(sellerId);
      return NextResponse.json({ success: true, data: { hasPending } }, { status: 200 });
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ─── US003-C: Detalle del Pedido ─────────────────────────────────────────

  async getDetail(orderId: string): Promise<NextResponse> {
    try {
      const orderDetail = await this.detailService.getOrderDetail(orderId);
      return NextResponse.json({ success: true, data: orderDetail }, { status: 200 });
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getPaymentSummary(orderId: string): Promise<NextResponse> {
    try {
      const payments = await this.detailService.getOrderPaymentSummary(orderId);
      return NextResponse.json({ success: true, data: payments }, { status: 200 });
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ─── US003-B: Actualización de Estado ────────────────────────────────────

  async changeStatus(
    orderId: string, 
    status: OrderStatus, 
    sellerId: string
  ): Promise<NextResponse> {
    try {
      const updatedOrder = await this.statusService.changeOrderStatus(orderId, status, sellerId);
      return NextResponse.json(
        { success: true, message: "Estado actualizado correctamente", data: updatedOrder },
        { status: 200 }
      );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async logHistory(
    orderId: string, 
    status: OrderStatus, 
    sellerId: string
  ): Promise<NextResponse> {
    try {
      const historyRecord = await this.statusService.logStatusHistory(orderId, status, sellerId);
      return NextResponse.json({ success: true, data: historyRecord }, { status: 201 });
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ─── US003-D: Notificaciones ─────────────────────────────────────────────

  async triggerBuyerNotification(orderId: string): Promise<NextResponse> {
    try {
      const result = await this.notificationService.notifyBuyer(orderId);
      return NextResponse.json(
        { success: true, message: "Notificación procesada con éxito", data: result },
        { status: 200 }
      );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ─── Método de Apoyo para Manejo de Errores en Next.js ───────────────────

  private handleError(error: any): NextResponse {
    const msg = error.message || "Error interno del servidor";
    
    if (msg.includes("requerido") || msg.includes("no tiene email")) {
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    } else if (msg.includes("No se encontró")) {
      return NextResponse.json({ success: false, error: msg }, { status: 404 });
    } else {
      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
  }
}