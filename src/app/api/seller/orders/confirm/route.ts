import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { orderStockService } from "@/services/seller/stock/orderStock.service";
import { stockAlertService } from "@/services/seller/stock/stockAlert.service";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId requerido" }, { status: 400 });

    const result = await orderStockService.processStockReduction(orderId);

    const orderItems = await prisma.orderItem.findMany({ where: { order_id: orderId } });
    await Promise.allSettled(
      orderItems.map(item => stockAlertService.evaluateProductStock(item.product_id))
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}