// En src/services/buyer/cupon/validaCupon.service.ts
import { ValidaCuponRepository } from "@/repositories/buyer/cupon/validaCupon.repository";

export class ValidaCuponService {
  async validateCouponForCart(code: string, cartProductIds: string[]) {
    if (!code) throw new Error("Se requiere ingresar un código de cupón.");

    const validIds = (cartProductIds || []).filter(Boolean);
    if (validIds.length === 0) throw new Error("No hay productos válidos en el carrito.");

    const coupon = await ValidaCuponRepository.getCouponByCode(code);
    if (!coupon) throw new Error("Cupón no válido o inexistente.");
    if (!coupon.is_active) throw new Error("Este cupón ha sido desactivado.");
    if (coupon.expires_at && new Date(coupon.expires_at as any) < new Date()) {
      throw new Error("Lo sentimos, este cupón ha expirado.");
    }

    const matchingProducts = await ValidaCuponRepository.getMatchingProducts(validIds, coupon.seller_id);
    if (matchingProducts.length === 0) {
      throw new Error("Este cupón no aplica a los productos de tu carrito.");
    }

    const baseSubtotal = matchingProducts.reduce((acc, p) => acc + Number(p.price), 0);

    return {
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        seller_id: coupon.seller_id,
        appliedToNames: matchingProducts.map(p => p.name).join(", "),
        appliedProductIds: matchingProducts.map(p => p.id),
        baseSubtotal: baseSubtotal
      }
    };
  }
}