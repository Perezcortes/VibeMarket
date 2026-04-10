import { NextResponse } from "next/server";
import { CartRemoveService } from "@/services/seller/shoppingCart/DeletProduct.service";
import { CartRemoveItemRepository } from "@/repositories/seller/shopingCart/DeletProduct.repository";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartItemId = searchParams.get('id');

  if (!cartItemId) return NextResponse.json({ error: "ID faltante" }, { status: 400 });

  const service = new CartRemoveService(CartRemoveItemRepository);
  
  try {
    await service.removeSingleItem(cartItemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}