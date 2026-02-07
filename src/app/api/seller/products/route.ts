import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Helper para validar sesión de vendedor
async function getSellerSession() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "vendedor") return null;
  return (session.user as any).id;
}

// GET: Tus productos
export async function GET() {
  const sellerId = await getSellerSession();
  if (!sellerId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { seller_id: sellerId }, // FILTRO CLAVE: Solo tus productos
    include: { category: true, images: true },
    orderBy: { created_at: 'desc' }
  });

  const categories = await prisma.category.findMany();
  return NextResponse.json({ products, categories });
}

// POST: Crear
export async function POST(req: Request) {
  const sellerId = await getSellerSession();
  if (!sellerId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  // Slug único con timestamp para evitar duplicados
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
            seller_id: sellerId, // Asignación directa
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
    
    // Verificar propiedad
    const existing = await prisma.product.findFirst({
        where: { id: body.id, seller_id: sellerId }
    });

    if(!existing) return NextResponse.json({ error: "No encontrado o no eres el dueño" }, { status: 404 });

    // Preparamos los datos dinámicamente (sirve para Edición completa y para Quick Update)
    const dataToUpdate: any = {};
    if (body.name) dataToUpdate.name = body.name;
    if (body.description) dataToUpdate.description = body.description;
    if (body.price) dataToUpdate.price = parseFloat(body.price);
    if (body.stock !== undefined) dataToUpdate.stock = parseInt(body.stock);
    if (body.category_id) dataToUpdate.category_id = parseInt(body.category_id);
    if (body.is_active !== undefined) dataToUpdate.is_active = body.is_active;

    // Si mandan imagen nueva, actualizamos la primera imagen (simplificado)
    if (body.image) {
        // Borramos anteriores y creamos nueva (Estrategia simple)
        await prisma.productImage.deleteMany({ where: { product_id: body.id }});
        await prisma.productImage.create({
            data: { product_id: body.id, url: body.image }
        });
    }

    const updatedProduct = await prisma.product.update({
        where: { id: body.id },
        data: dataToUpdate
    });

    return NextResponse.json(updatedProduct);
}

// DELETE: Eliminar producto
export async function DELETE(req: Request) {
    const sellerId = await getSellerSession();
    if (!sellerId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    // Verificar propiedad
    const existing = await prisma.product.findFirst({
        where: { id, seller_id: sellerId }
    });

    if(!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    // Primero borramos imágenes relacionadas (Cascada manual si Prisma no lo hace)
    await prisma.productImage.deleteMany({ where: { product_id: id }});
    
    await prisma.product.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });
}