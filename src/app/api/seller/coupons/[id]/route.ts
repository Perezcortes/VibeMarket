/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: API Route — Gestión de Estado de Cupones
 * Historias: US004-C
 * RUTA: /api/seller/coupons/[id]/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CouponStatusService } from "@/services/seller/discounts/Cuoponstatus.service";
import { CouponStatusRepository } from "@/repositories/seller/discounts/CuoponStatus.repository";
import { DiscountPresenter, RawCoupon } from "@/presentation/seller/discounts/discounts.presenter";

const statusService = new CouponStatusService(CouponStatusRepository);

export async function PATCH(
  req: NextRequest,
  // 1. Definimos params como una Promesa para cumplir con Next.js 15
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { action, currentState } = await req.json();

    // 2. Esperamos a que la promesa de params se resuelva para obtener el id
    const { id } = await params; 

    let updated;
    if (action === "activate") {
      updated = await statusService.activateCoupon(id);
    } else if (action === "deactivate") {
      updated = await statusService.deactivateCoupon(id);
    } else if (action === "toggle") {
      updated = await statusService.toggleCoupon(id, Boolean(currentState));
    } else {
      return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
    }

    // Validamos que el servicio haya devuelto un cupón actualizado
    if (!updated) {
      return NextResponse.json({ error: "No se pudo actualizar el cupón." }, { status: 404 });
    }

    const formatted = DiscountPresenter.format(updated as unknown as RawCoupon);
    return NextResponse.json({ data: formatted }, { status: 200 });

  } catch (error: unknown) {
    console.error("[PATCH /api/seller/coupons/[id]]", error);
    const message =
      error instanceof Error ? error.message : "Error al cambiar el estado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}