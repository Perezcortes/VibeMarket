/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Archivo de API Único (Catch-all) para el módulo de Pedidos
 * Ubicación: app/api/seller/orders/[[...path]]/route.ts
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Ajusta a tu ruta real

// 1. Importamos la Clase
import { OrderPresenter } from "@/presentation/seller/order/Order.presenter";

// 2. Importamos los Servicios (Ajusta las rutas a tu proyecto)
import { OrderMonitoringService } from "@/services/seller/orders/Ordermonitoring.service";
import { OrderStatusService } from "@/services/seller/orders/Orderstatus.service";
import { OrderDetailService } from "@/services/seller/orders/orderdetail.service";
import { OrderNotificationService } from "@/services/seller/orders/Ordernotification.service";

// 3. Importamos los Repositorios (Ajusta las rutas a tu proyecto)
import { OrderMonitoringRepository } from "@/repositories/seller/orders/OrderMonitoring.repository";
import { OrderPersistenceRepository } from "@/repositories/seller/orders/Orderstatus.repository";
import { OrderDetailPersistenceRepository } from "@/repositories/seller/orders/OrderDetails.repository";
import { OrderNotificationPersistenceRepository } from "@/repositories/seller/orders/OrderNotification.repository";

// ─── INSTANCIACIÓN DE DEPENDENCIAS ─────────────────────────────────────────

const monitoringService = new OrderMonitoringService(OrderMonitoringRepository);
const statusService = new OrderStatusService(OrderPersistenceRepository);
const detailService = new OrderDetailService(OrderDetailPersistenceRepository);
const notificationService = new OrderNotificationService(OrderNotificationPersistenceRepository);

// Creamos la variable orderPresenter (en minúscula)
const orderPresenter = new OrderPresenter(
  monitoringService,
  statusService,
  detailService,
  notificationService
);

// ─── MIDDLEWARE INTERNO DE SESIÓN ──────────────────────────────────────────
async function getValidSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("No autorizado");
  }
  return session;
}

// ─── MANEJADOR GET ─────────────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const session = await getValidSession();
    const resolvedParams = await params; // Esperamos la Promesa de Next.js 15
    const path = resolvedParams.path || []; // Si está vacío, es la ruta raíz: /api/seller/orders

    // 1. GET /api/seller/orders
    if (path.length === 0) {
      return orderPresenter.getReceivedOrders(session.user.id);
    }

    // 2. GET /api/seller/orders/pending-status
    if (path.length === 1 && path[0] === "pending-status") {
      return orderPresenter.checkPendingOrders(session.user.id);
    }

    // 3. GET /api/seller/orders/:orderId
    if (path.length === 1) {
      const orderId = path[0];
      return orderPresenter.getDetail(orderId);
    }

    // 4. GET /api/seller/orders/:orderId/payments
    if (path.length === 2 && path[1] === "payments") {
      const orderId = path[0];
      return orderPresenter.getPaymentSummary(orderId);
    }

    return NextResponse.json({ error: "Ruta GET no encontrada" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// ─── MANEJADOR PATCH ───────────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const session = await getValidSession();
    const resolvedParams = await params; // Esperamos la Promesa de Next.js 15
    const path = resolvedParams.path || [];

    // 1. PATCH /api/seller/orders/:orderId/status
    if (path.length === 2 && path[1] === "status") {
      const orderId = path[0];
      const body = await request.json();
      return orderPresenter.changeStatus(orderId, body.status, session.user.id);
    }

    return NextResponse.json({ error: "Ruta PATCH no encontrada" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// ─── MANEJADOR POST ────────────────────────────────────────────────────────
export async function POST(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const session = await getValidSession();
    const resolvedParams = await params; // Esperamos la Promesa de Next.js 15
    const path = resolvedParams.path || [];

    // 1. POST /api/seller/orders/:orderId/history
    if (path.length === 2 && path[1] === "history") {
      const orderId = path[0];
      const body = await request.json();
      return orderPresenter.logHistory(orderId, body.status, session.user.id);
    }

    // 2. POST /api/seller/orders/:orderId/notify
    if (path.length === 2 && path[1] === "notify") {
      const orderId = path[0];
      return orderPresenter.triggerBuyerNotification(orderId);
    }

    return NextResponse.json({ error: "Ruta POST no encontrada" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}