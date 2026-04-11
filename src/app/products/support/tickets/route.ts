import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 

// GET: Obtener tickets con sus mensajes y usuario
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Validación de seguridad: Solo soporte o admin
  const userRole = (session?.user as any)?.role;
  if (!session || (userRole !== "admin" && userRole !== "soporte")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: { 
          select: { id: true, full_name: true, email: true } 
        },
        chat_messages: {
          orderBy: { created_at: 'asc' },
          include: {
             sender: { select: { full_name: true, role: true } }
          }
        }
      },
      orderBy: { updated_at: 'desc' }
    });
    
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener tickets" }, { status: 500 });
  }
}

// PUT: Responder un ticket (Crear mensaje + Actualizar estado)
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as any).id; // ID del que responde (Soporte)

  try {
    const body = await req.json();
    const { ticketId, message, status } = body;

    // 1. Si hay mensaje nuevo, lo guardamos en TicketMessage
    if (message) {
      await prisma.ticketMessage.create({
        data: {
          ticket_id: ticketId,
          sender_id: userId,
          message: message
        }
      });
    }

    // 2. Actualizamos el estado del ticket principal
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { 
        status: status, 
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar ticket" }, { status: 500 });
  }
}