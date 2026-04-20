import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const history = await prisma.payment.findMany({
      where: {
        order: { buyer_id: session.user.id }
      },
      include: {
        order: true,
        card_details: true // Traemos los detalles de la tarjeta si existen
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  }
}