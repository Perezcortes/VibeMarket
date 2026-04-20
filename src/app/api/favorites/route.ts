import { NextResponse } from "next/server";
import { FavoriteService } from "@/services/seller/catalog/FavoriteProduct.service";
import { FavoriteRepository } from "@/repositories/seller/catalog/FavoriteProduct.repository";

export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json();
    const service = new FavoriteService(FavoriteRepository);
    
    const result = await service.toggleProductFavorite(userId, productId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}