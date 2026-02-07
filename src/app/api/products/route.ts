import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 

export async function GET() {
  const products = await prisma.product.findMany({
    where: { is_active: true }
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Validación de Rol
  const role = (session?.user as any)?.role;
  if (!session || role !== "vendedor") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  
  // Creación del producto
  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      // Asigna el vendedor logueado
      seller: {
        connect: { id: (session.user as any).id }
      }
    }
  });

  return NextResponse.json(newProduct, { status: 201 });
}