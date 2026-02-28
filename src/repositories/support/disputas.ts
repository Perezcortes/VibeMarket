import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const abrirDisputa = async (orderId: string, motivo: string) => {
  return await prisma.dispute.create({
    data: {
      order_id: orderId,
      reason: motivo,
    },
  });
};

export const resolverDisputa = async (disputeId: string, solucion: string, soporteId: string) => {
  return await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      resolution: solucion,
      status: "resuelta",
      moderator_id: soporteId
    },
  });
};