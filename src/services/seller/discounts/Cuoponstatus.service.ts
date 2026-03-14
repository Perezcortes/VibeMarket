/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Gestión de Estado de Cupones
 * Historia de Usuario: US004-C
 * AUTOR (Responsable): [Tu Nombre]
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

import { CouponStatusRepository } from "@/repositories/seller/discounts/CuoponStatus.repository";

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class CouponStatusService {
  constructor(
    private readonly repository: typeof CouponStatusRepository
  ) {}

  /**
   * Activa un cupón estableciendo is_active = true.
   *
   * @param couponId - ID del cupón a activar
   * @returns El cupón actualizado
   * @throws Error si couponId es inválido
   */
  async activateCoupon(couponId: string) {
    if (!couponId || couponId.trim() === "") {
      throw new Error("El ID del cupón es requerido.");
    }

    return this.repository.execute(couponId, true);
  }

  /**
   * Desactiva un cupón estableciendo is_active = false.
   *
   * @param couponId - ID del cupón a desactivar
   * @returns El cupón actualizado
   * @throws Error si couponId es inválido
   */
  async deactivateCoupon(couponId: string) {
    if (!couponId || couponId.trim() === "") {
      throw new Error("El ID del cupón es requerido.");
    }

    return this.repository.execute(couponId, false);
  }

  /**
   * Alterna el estado del cupón (toggle).
   * Si está activo lo desactiva, y viceversa.
   *
   * @param couponId  - ID del cupón
   * @param currentState - Estado actual del cupón
   * @returns El cupón con el estado invertido
   */
  async toggleCoupon(couponId: string, currentState: boolean) {
    if (!couponId || couponId.trim() === "") {
      throw new Error("El ID del cupón es requerido.");
    }

    return this.repository.execute(couponId, !currentState);
  }
}