// src/app/api/seller/returns/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// MÉTODO PARA OBTENER LAS SOLICITUDES
export async function GET() {
  try {
    // PRUEBA: Traemos TODO sin filtrar por sesión para ver si aparece en el dashboard
    const allReturns = await prisma.returnRequest.findMany({
      include: {
        order: {
          include: {
            buyer: true,
            items: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log("Devoluciones encontradas en DB:", allReturns.length);
    return NextResponse.json(allReturns);
  } catch (error) {
    console.error("Error en API GET:", error);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}

// MÉTODO PARA ACTUALIZAR EL ESTADO (APROBAR/RECHAZAR)
export async function PATCH(req: Request) {
  try {
    const { id, newStatus } = await req.json();

    if (!id || !newStatus) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Actualizamos el estado en Prisma
    const updatedReturn = await prisma.returnRequest.update({
      where: { id: id },
      data: { status: newStatus },
    });

    // Devolvemos la solicitud actualizada
    return NextResponse.json(updatedReturn, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar la devolución:", error);
    return NextResponse.json({ error: "Error interno al actualizar" }, { status: 500 });
  }
}