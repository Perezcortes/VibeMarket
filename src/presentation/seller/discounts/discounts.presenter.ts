/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Presentador de Cupones
 * Historias: US004-A | US004-B | US004-C
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

import { DiscountType } from "@prisma/client";

// ─── Tipos de entrada (lo que devuelve Prisma) ─────────────────────────────
export interface RawCoupon {
  id: string;
  seller_id: string;
  code: string;
  type: DiscountType;
  value: number | { toNumber(): number }; // Prisma Decimal
  expires_at: Date | null;
  is_active: boolean;
  created_at: Date;
}

// ─── ViewModel (lo que consume la UI) ─────────────────────────────────────
export interface CouponViewModel {
  id: string;
  code: string;
  typeLabel: string;          // "Porcentaje" | "Monto fijo"
  valueDisplay: string;       // "15%" | "$50.00"
  statusLabel: string;        // "Activo" | "Inactivo"
  statusColor: string;        // clases Tailwind para el badge
  expiresLabel: string;       // "Sin vencimiento" | "Vence el 12/06/2025" | "Vencido"
  isExpired: boolean;
  isActive: boolean;
  createdAt: string;          // Fecha formateada "dd/mm/yyyy"
}

// ─── Presenter ────────────────────────────────────────────────────────────
export class DiscountPresenter {
  /**
   * Convierte un único cupón crudo en un ViewModel listo para la UI.
   */
  static format(coupon: RawCoupon): CouponViewModel {
    const value =
      typeof coupon.value === "object" ? coupon.value.toNumber() : coupon.value;

    const now = new Date();
    const isExpired = coupon.expires_at !== null && coupon.expires_at <= now;

    // ── Tipo ────────────────────────────────────────────────────────────────
    const typeLabel =
      coupon.type === DiscountType.porcentaje ? "Porcentaje" : "Monto fijo";

    const valueDisplay =
      coupon.type === DiscountType.porcentaje
        ? `${value}%`
        : `$${value.toFixed(2)}`;

    // ── Estado (US004-C) ────────────────────────────────────────────────────
    const isActive = coupon.is_active && !isExpired;
    const statusLabel = isActive ? "Activo" : "Inactivo";
    const statusColor = isActive
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";

    // ── Vigencia (US004-A) ──────────────────────────────────────────────────
    let expiresLabel = "Sin vencimiento";
    if (coupon.expires_at) {
      const formatted = coupon.expires_at.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      expiresLabel = isExpired ? `Vencido (${formatted})` : `Vence el ${formatted}`;
    }

    // ── Fecha de creación ───────────────────────────────────────────────────
    const createdAt = coupon.created_at.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return {
      id: coupon.id,
      code: coupon.code.toUpperCase(),
      typeLabel,
      valueDisplay,
      statusLabel,
      statusColor,
      expiresLabel,
      isExpired,
      isActive,
      createdAt,
    };
  }

  /**
   * Formatea una lista de cupones. Filtra opcionalmente solo los activos.
   *
   * @param coupons     - Lista de cupones crudos de Prisma
   * @param onlyActive  - Si true, retorna solo cupones activos y vigentes
   */
  static formatList(
    coupons: RawCoupon[],
    onlyActive = false
  ): CouponViewModel[] {
    const formatted = coupons.map(DiscountPresenter.format);
    return onlyActive ? formatted.filter((c) => c.isActive) : formatted;
  }
}