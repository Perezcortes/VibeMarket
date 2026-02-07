"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TicketStatus, TicketPriority } from "@prisma/client";

export async function getTickets() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: { 
        user: { 
          select: { 
            full_name: true, 
            email: true 
          } 
        } 
      },
      orderBy: { created_at: 'desc' },
    });
    return tickets;
  } catch (error) {
    console.error("Error al obtener tickets reales:", error);
    return [];
  }
}

export async function createTicket(formData: FormData) {
  try {
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const priority = formData.get("priority") as TicketPriority;

    // AHORA USA EL ID QUE CREASTE EN PRISMA STUDIO
    const tempUserId = "cm6m1";

    await prisma.supportTicket.create({
      data: {
        subject,
        message,
        priority,
        user_id: tempUserId, 
      },
    });

    revalidatePath("/support/tickets");
    return { success: true };
  } catch (error) {
    console.error("Error al crear ticket en DB:", error);
    return { success: false, error: "No se pudo guardar el ticket." };
  }
}

export async function getTicketById(id: string) {
  try {
    return await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: true,
        assigned: true, 
      }
    });
  } catch (error) {
    console.error("Error al obtener el detalle:", error);
    return null;
  }
}

export async function updateTicketStatus(id: string, status: TicketStatus) {
  try {
    await prisma.supportTicket.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath("/support/tickets");
    revalidatePath(`/support/tickets/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return { success: false };
  }
}