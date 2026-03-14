/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Visualización de Ofertas y Descuentos
 * Historia de Usuario: HU003 - Visualización de ofertas y descuentos
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { DiscountType } from "@prisma/client";
import { ProductDiscountRepository } from "@/repositories/seller/catalog/ProductDiscount.repository";

// ─── Interfaces de Salida (DTOs para la Vista) ──────────────────────────────
export interface DiscountDetail {
  code: string;
  type: DiscountType;
  value: number;
  finalPrice: number;
  savings: number;
}

export interface ProductOfferDTO {
  id: string;
  name: string;
  originalPrice: number;
  sellerName: string;
  availableDiscounts: DiscountDetail[];
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class ProductDiscountService {
  constructor(
    private readonly repository: typeof ProductDiscountRepository
  ) {}

  /**
   * HU003 — Obtiene un producto y calcula los posibles precios con descuento.
   * * @param slug - El slug único del producto
   * @returns Objeto con detalles del producto y lista de descuentos aplicables
   * @throws Error si el producto no existe o no está activo
   */
  async getProductWithOffers(slug: string): Promise<ProductOfferDTO> {
    const product = await this.repository.execute(slug);

    if (!product) {
      throw new Error("El producto no existe o no se encuentra disponible.");
    }

    // Convertimos el precio base a number una sola vez para usarlo en el mapeo
    const productPrice = Number(product.price);

    // Mapear los cupones del vendedor y calcular el precio final para cada uno
    const discounts: DiscountDetail[] = product.seller.coupons.map((coupon) => {
      const couponValue = Number(coupon.value);

      const finalPrice = this.calculateFinalPrice(
        productPrice, 
        coupon.type, 
        couponValue
      );

      return {
        code: coupon.code,
        type: coupon.type,
        value: couponValue,
        finalPrice: finalPrice,
        savings: productPrice - finalPrice
      };
    });

    return {
      id: product.id,
      name: product.name,
      originalPrice: productPrice, // Aquí ya es number, corregido para ProductOfferDTO
      sellerName: product.seller.full_name,
      availableDiscounts: discounts
    };
  }

  /**
   * HU003 — Regla de negocio: Calcula el precio final tras aplicar un cupón.
   * * @param price - Precio base del producto (number)
   * @param type  - Tipo de descuento (porcentaje o monto_fijo)
   * @param value - Valor numérico del descuento (number)
   * @returns El precio final (mínimo 0)
   */
  private calculateFinalPrice(price: number, type: DiscountType, value: number): number {
    if (type === DiscountType.porcentaje) {
      const discountAmount = (price * value) / 100;
      return Math.max(0, price - discountAmount);
    }

    // Caso: monto_fijo
    return Math.max(0, price - value);
  }
}