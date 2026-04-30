import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// MÉTODO POST: Para crear la solicitud de devolución
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { orderId, reason, description } = await req.json();

    // 1. Verificamos que la orden exista en la base de datos
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Referencia de pedido no encontrada" }, { status: 404 });
    }

    // 2. Creamos el registro de la solicitud para que el vendedor la vea
    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId: orderId,
        reason: reason,
        description: description,
        status: "PENDING", // Estado inicial para revisión del vendedor
      },
    });

    return NextResponse.json(returnRequest, { status: 201 });

  } catch (error) {
    console.error("Error al procesar la devolución en VibeMarket:", error);
    return NextResponse.json({ error: "Fallo técnico al registrar la solicitud" }, { status: 500 });
  }
}

// MÉTODO GET: Para recuperar el historial de compras del usuario
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const history = await prisma.order.findMany({
      where: {
        buyer_id: session.user.id
      },
      include: {
        items: true,
      },
      orderBy: { 
        id: 'desc' 
      }
    });

    return NextResponse.json(history);
    
  } catch (error) {
    console.error("Error en el historial de VibeMarket:", error);
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  }
}