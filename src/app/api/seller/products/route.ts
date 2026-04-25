/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: API Route — Productos del Vendedor
 * Historias: US002-B (Decremento automático) | US002-C (Alerta stock bajo)
 * RUTA: /api/seller/products/route.ts
 */
 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
 
// ─── US002-B + US002-C: Importamos los servicios de stock ──────────────────
// NUEVO: Antes no existían estos imports. Se agregan para que la API
// pueda ejecutar el decremento y evaluar alertas tras cada compra.
import { orderStockService } from "@/services/seller/stock/orderStock.service";
import { stockAlertService } from "@/services/seller/stock/stockAlert.service";
 
// Helper para validar sesión de vendedor
async function getSellerSession() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "vendedor") return null;
  return (session.user as any).id;
}
 
// GET: Tus productos (sin cambios)
export async function GET() {
  const sellerId = await getSellerSession();
  if (!sellerId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
 
  const products = await prisma.product.findMany({
    where: { seller_id: sellerId },
    include: { category: true, images: true },
    orderBy: { created_at: 'desc' }
  });
 
  const categories = await prisma.category.findMany();
  return NextResponse.json({ products, categories });
}
 
// POST: Crear producto (sin cambios)
export async function POST(req: Request) {
  const sellerId = await getSellerSession();
  if (!sellerId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
 
  const body = await req.json();
  const slug = body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
 
  try {
    const newProduct = await prisma.product.create({
        data: {
            name: body.name,
            slug: slug,
            description: body.description,
            price: parseFloat(body.price),
            stock: parseInt(body.stock),
            category_id: parseInt(body.category_id),
            seller_id: sellerId,
            images: { create: { url: body.image } }
        }
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}
 
// PUT: Editar completo o Actualizar Stock/Estado
export async function PUT(req: Request) {
    const sellerId = await getSellerSession();
    if (!sellerId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  
    const body = await req.json();
    
    const existing = await prisma.product.findFirst({
        where: { id: body.id, seller_id: sellerId }
    });
    if (!existing) return NextResponse.json({ error: "No encontrado o no eres el dueño" }, { status: 404 });
 
    const dataToUpdate: any = {};
    if (body.name) dataToUpdate.name = body.name;
    if (body.description) dataToUpdate.description = body.description;
    if (body.price) dataToUpdate.price = parseFloat(body.price);
    if (body.stock !== undefined) dataToUpdate.stock = parseInt(body.stock);
    if (body.category_id) dataToUpdate.category_id = parseInt(body.category_id);
    if (body.is_active !== undefined) dataToUpdate.is_active = body.is_active;
 
    if (body.image) {
        await prisma.productImage.deleteMany({ where: { product_id: body.id }});
        await prisma.productImage.create({ data: { product_id: body.id, url: body.image } });
    }
 
    const updatedProduct = await prisma.product.update({
        where: { id: body.id },
        data: dataToUpdate
    });
 
    // ─── US002-C: Evaluar alerta después de edición manual de stock ────────
    // NUEVO: Cuando el vendedor ajusta el stock manualmente desde el catálogo
    // (+1 / -1), evaluamos si quedó en nivel crítico para disparar la alerta.
    // Solo se ejecuta si el body incluye el campo "stock".
    if (body.stock !== undefined) {
      await stockAlertService.evaluateProductStock(body.id).catch((err) => {
        // No bloqueamos la respuesta si la alerta falla
        console.error("[PUT /api/seller/products] Error en alerta de stock:", err);
      });
    }
 
    return NextResponse.json(updatedProduct);
}
 
// DELETE: Eliminar producto (sin cambios)
export async function DELETE(req: Request) {
    const sellerId = await getSellerSession();
    if (!sellerId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
 
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
 
    const existing = await prisma.product.findFirst({
        where: { id, seller_id: sellerId }
    });
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
 
    await prisma.productImage.deleteMany({ where: { product_id: id }});
    await prisma.product.delete({ where: { id } });
 
    return NextResponse.json({ success: true });
}
 
 