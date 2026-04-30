import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { orderId, reason, description } = await req.json();

    // 1. Validar si ya existe una solicitud para esta orden (evita error P2002 de Prisma)
    const existingRequest = await prisma.returnRequest.findUnique({
      where: { orderId: orderId }
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Ya existe una solicitud para este pedido" }, { status: 400 });
    }

    // 2. Crear la solicitud en la base de datos usando el Enum ReturnStatus
    const newReturn = await prisma.returnRequest.create({
      data: {
        orderId: orderId,
        reason: reason,
        description: description,
        status: "PENDING", // Estado inicial definido en el Enum
      },
    });

    return NextResponse.json(newReturn, { status: 201 });

  } catch (error) {
    console.error("Error al guardar devolución:", error);
    return NextResponse.json({ error: "Error técnico al procesar el registro" }, { status: 500 });
  }
}

// Mantén tu método GET aquí abajo para que el historial siga funcionando...
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const history = await prisma.order.findMany({
      where: { buyer_id: session.user.id },
      include: { items: true },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  }
}