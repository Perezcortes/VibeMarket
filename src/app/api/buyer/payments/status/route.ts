import { NextResponse } from "next/server";
import { paymentErrorService } from "@/services/buyer/payments/errorPago.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: "Falta el ID del pedido" }, { status: 400 });
  }

  try {
    const statusData = await paymentErrorService.checkPaymentStatus(orderId);
    return NextResponse.json(statusData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}