// ════════════════════════════════════════════════════════════════════
//  /api/seller/coupons/[id]/route.ts  →  pega este bloque en ese archivo
// ════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CouponStatusService } from "@/services/seller/discounts/Cuoponstatus.service";
import { CouponStatusRepository } from "@/repositories/seller/discounts/CuoponStatus.repository";
import { DiscountPresenter, RawCoupon } from "@/presentation/seller/discounts/discounts.presenter";

const statusService = new CouponStatusService(CouponStatusRepository);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { action, currentState } = await req.json();
    const { id } = params;

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

    const formatted = DiscountPresenter.format(updated as unknown as RawCoupon);
    return NextResponse.json({ data: formatted }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al cambiar el estado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}