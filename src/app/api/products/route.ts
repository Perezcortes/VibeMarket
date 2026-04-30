import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // US010-A: Obtener el nombre
  const query = searchParams.get("q") || "";
  // US010-B: Obtener categoría
  const category = searchParams.get("category") || "";
  // US010-C: Rango de precios
  const minPrice = Number(searchParams.get("min")) || 0;
  const maxPrice = Number(searchParams.get("max")) || 999999;
  // US010-D: Ordenamiento
  const sort = searchParams.get("sort") === "desc" ? "desc" : "asc";

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { name: { contains: query } }, // Búsqueda por nombre
          category ? { category: { name: category } } : {}, // Filtro categoría
          {
            price: {
              gte: minPrice, // Precio mayor o igual a
              lte: maxPrice, // Precio menor o igual a
            },
          },
        ],
      },
      orderBy: {
        price: sort as any, // Ordenamiento descendente o ascendente
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error al filtrar" }, { status: 500 });
  }
}