/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Compradores / Pago
 * Historia de Usuario: US012-G: Como comprador, quiero validar el cupón al momento del pago,
 * para saber si realmente tengo mi descuento.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): 
 * FECHA: 5 de marzo de 2026
 */

import {  ValidaCuponRepository } from "@/repositories/buyer/cupon/validaCupon.repository";

// Aquí inicia la lógica de la capa de servicio
export class ValidaCuponService {
  
  /**
   * Valida el estado de un cupón por su ID.
   * @param couponId Identificador del cupón (UUID).
   */
  async validateCoupon(couponId: string) {
    if (!couponId) {
      throw new Error("Se requiere un ID de cupón válido para validar.");
    }

    try {
      // Llamamos al repositorio para obtener el estado del cupón
      const couponState = await ValidaCuponRepository.getCouponState(couponId);
      
      return {
        success: true,
        message: `El estado del cupón es: ${couponState}.`,
        data: couponState
      };
    } catch (error) {
      // Manejo de errores
      return {
        success: false,
        message: "Ocurrió un error al validar el cupón.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
    }
}
