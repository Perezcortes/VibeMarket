import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Busca respuestas en la tabla de conocimiento usando palabras clave.
 */
export const buscarEnFaq = async (termino: string) => {
  return await prisma.faqKnowledge.findMany({
    where: {
      OR: [
        { question: { contains: termino } },
        { answer: { contains: termino } },
        { category: { contains: termino } }
      ]
    },
    orderBy: { times_used: 'desc' } // Prioriza las más usadas
  });
};