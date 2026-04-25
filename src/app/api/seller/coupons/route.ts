/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: API Route — Cupones del Vendedor
 * Historias: US004-A | US004-B | US004-C
 * RUTA: /api/seller/coupons/route.ts          (GET, POST)
 * RUTA: /api/seller/coupons/[id]/route.ts     (PATCH)
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

// ════════════════════════════════════════════════════════════════════
//  /api/seller/coupons/route.ts
// ════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import { CouponCreateService } from "@/services/seller/discounts/CuoponCreate.service";
import { CouponCreateRepository } from "@/repositories/seller/discounts/CuoponCreate.repository";
import { DiscountPresenter, RawCoupon } from "@/presentation/seller/discounts/discounts.presenter";
import { prisma } from "@/lib/prisma";

// ─── Instancia del servicio ────────────────────────────────────────
const createService = new CouponCreateService(CouponCreateRepository);

// ─── GET /api/seller/coupons ───────────────────────────────────────
// Retorna los cupones del vendedor autenticado formateados para la UI.
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get("active") === "true";

    const raw = await prisma.coupon.findMany({
      where: { seller_id: session.user.id },
      orderBy: { created_at: "desc" },
    });

    const data = DiscountPresenter.formatList(raw as unknown as RawCoupon[], onlyActive);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/seller/coupons]", error);
    return NextResponse.json(
      { error: "Error al obtener los cupones." },
      { status: 500 }
    );
  }
}

// ─── POST /api/seller/coupons ──────────────────────────────────────
// Crea un nuevo cupón (US004-A + US004-B).
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = await req.json();

    const coupon = await createService.createCoupon({
      seller_id: session.user.id,
      code: body.code,
      type: body.type,
      value: Number(body.value),
      expires_at: body.expires_at ? new Date(body.expires_at) : undefined,
    });

    const formatted = DiscountPresenter.format(coupon as unknown as RawCoupon);

    return NextResponse.json({ data: formatted }, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al crear el cupón.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


