/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Creación de Cupones
 * Historia de Usuario: US004-A (Vigencia) | US004-B (Reglas de descuento)
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

import { DiscountType } from "@prisma/client";
import { CouponCreateRepository } from "@/repositories/seller/discounts/CuoponCreate.repository";

// ─── DTO de entrada ────────────────────────────────────────────────────────
export interface CreateCouponDTO {
  seller_id: string;
  code: string;
  type: DiscountType;
  value: number;
  expires_at?: Date;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class CouponCreateService {
  constructor(
    private readonly repository: typeof CouponCreateRepository
  ) {}

  /**
   * US004-A + US004-B
   * Crea un cupón validando vigencia y reglas de descuento antes de persistir.
   *
   * @param data - Datos del cupón a crear
   * @returns El cupón creado
   * @throws Error si alguna validación falla
   */
  async createCoupon(data: CreateCouponDTO) {
    // ── Validaciones generales ─────────────────────────────────────────────
    if (!data.seller_id || data.seller_id.trim() === "") {
      throw new Error("El ID del vendedor es requerido.");
    }
    if (!data.code || data.code.trim() === "") {
      throw new Error("El código del cupón es requerido.");
    }

    // ── US004-B: Validar reglas de descuento ───────────────────────────────
    if (data.value === undefined || data.value === null) {
      throw new Error("El valor del descuento es requerido.");
    }
    if (data.value <= 0) {
      throw new Error("El valor del descuento debe ser mayor a 0.");
    }
    if (data.type === DiscountType.porcentaje && data.value > 100) {
      throw new Error("El descuento por porcentaje no puede superar el 100%.");
    }

    // ── US004-A: Validar vigencia ──────────────────────────────────────────
    if (data.expires_at !== undefined) {
      const now = new Date();
      if (data.expires_at <= now) {
        throw new Error("La fecha de expiración debe ser futura.");
      }
    }

    // Omitir expires_at si no fue proporcionado (Prisma DateTime? requiere ausencia de clave)
    const { expires_at, ...rest } = data;
    const payload = expires_at !== undefined ? { ...rest, expires_at } : rest;
    return this.repository.execute(payload as typeof data);
  }

  /**
   * US004-A — Verifica si un cupón ya expiró comparando su fecha con la actual.
   *
   * @param expiresAt - Fecha de expiración del cupón
   * @returns true si el cupón está vigente, false si ya expiró
   */
  isStillValid(expiresAt?: Date): boolean {
    if (!expiresAt) return true; // Sin fecha de expiración = siempre válido
    return expiresAt > new Date();
  }

  /**
   * US004-B — Calcula el monto de descuento sobre un precio dado.
   *
   * @param price     - Precio original del producto
   * @param type      - Tipo de descuento (PERCENTAGE | FIXED)
   * @param value     - Valor del descuento
   * @returns Monto final a pagar después del descuento
   * @throws Error si el precio es inválido
   */
  applyDiscount(price: number, type: DiscountType, value: number): number {
    if (price <= 0) {
      throw new Error("El precio debe ser mayor a 0.");
    }

    if (type === DiscountType.porcentaje) {
      const discount = (price * value) / 100;
      return Math.max(0, price - discount);
    }

    // FIXED
    return Math.max(0, price - value);
  }
}