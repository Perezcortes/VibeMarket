import { NextResponse } from "next/server";
import { restoreCartService } from "@/services/buyer/payments/restoreCart.service";

export async function POST(req: Request) {
  try {
    // Recibimos userId en lugar de buyerId para que coincida con tu lógica
    const { orderId, userId } = await req.json();

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Faltan datos: orderId y userId son obligatorios" },
        { status: 400 }
      );
    }

    // Llamamos al servicio con el nuevo nombre de parámetro
    const result = await restoreCartService.restoreCartFromFailedOrder(orderId, userId);

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error("[API_RESTORE_CART_ERROR]:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al restaurar" },
      { status: 500 }
    );
  }
}