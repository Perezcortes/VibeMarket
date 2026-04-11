import { CartQuantityRepository } from "@/repositories/seller/shopingCart/ProductQuanrtity.repository";

export interface UpdatedCartItemDTO {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  wasAdjustedByStock: boolean; // US011-E: Indica si no hubo suficiente stock
}

export class CartQuantityService {
  constructor(private readonly repository: typeof CartQuantityRepository) {}

  async setItemQuantity(cartItemId: string, quantity: number): Promise<UpdatedCartItemDTO | { message: string }> {
    if (quantity < 0) throw new Error("La cantidad no puede ser negativa.");

    if (quantity === 0) {
      await this.repository.removeItem(cartItemId);
      return { message: "Producto eliminado del carrito." };
    }

    const result = await this.repository.updateQuantity({
      cartItemId,
      newQuantity: quantity
    });

    const unitPrice = Number(result.product.price);
    // Si la cantidad devuelta por el repo es menor a la solicitada, es que se agotó el stock
    const wasAdjusted = quantity > result.quantity;

    return {
      id: result.id,
      productName: result.product.name,
      quantity: result.quantity,
      unitPrice: unitPrice,
      totalPrice: unitPrice * result.quantity,
      wasAdjustedByStock: wasAdjusted
    };
  }
}