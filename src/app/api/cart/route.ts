import { NextResponse } from "next/server";

// Importaciones de Servicios
import { CartService } from "@/services/seller/shoppingCart/AddProduct.service";
import { CartQuantityService } from "@/services/seller/shoppingCart/ProductQuanrtity.service";
import { CartRemoveService } from "@/services/seller/shoppingCart/DeletProduct.service";

// Importaciones de Repositorios
import { CartAddProductRepository } from "@/repositories/seller/shopingCart/AddProduct.repository";
import { CartQuantityRepository } from "@/repositories/seller/shopingCart/ProductQuanrtity.repository";
import { CartRemoveItemRepository } from "@/repositories/seller/shopingCart/DeletProduct.repository";

/**
 * US011-A: AGREGAR PRODUCTO AL CARRITO
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = new CartService(CartAddProductRepository);
    
    const result = await service.addProduct({
      userId: body.userId,
      productId: body.productId,
      quantity: body.quantity,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * US011-B y E: ACTUALIZAR CANTIDAD Y VALIDAR STOCK
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const service = new CartQuantityService(CartQuantityRepository);
    
    const result = await service.setItemQuantity(body.cartItemId, body.newQuantity);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * US011-C: ELIMINAR PRODUCTO DEL CARRITO
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartItemId = searchParams.get('id');

  if (!cartItemId) {
    return NextResponse.json({ error: "ID faltante" }, { status: 400 });
  }

  const service = new CartRemoveService(CartRemoveItemRepository);
  
  try {
    await service.removeSingleItem(cartItemId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar" }, { status: 500 });
  }
}