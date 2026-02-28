import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

/**
 * HU018: Selección de método de pago
 * Criterio de aceptación: El comprador puede elegir y registrar el proveedor de pago
 * para una orden específica.
 */
export const PaymentMethodRepository = {

  /**
   * Registra el método de pago seleccionado para una orden.
   * Si ya existe un pago pendiente para esa orden, lo actualiza.
   */
  async execute(data: {
    order_id: string;
    provider: string; // Ej: "PayPal", "Stripe", "Tarjeta de Crédito"
    amount: number;
  }) {
    return prisma.payment.upsert({
      where: {
        // Asumiendo que quieres manejar un registro de pago por intento en esta etapa
        id: data.order_id, // O una lógica de búsqueda por order_id si prefieres permitir múltiples intentos
      },
      update: {
        provider: data.provider,
        amount: data.amount,
        status: "pendiente", // Reiniciamos a pendiente al cambiar de método
      },
      create: {
        order_id: data.order_id,
        provider: data.provider,
        amount: data.amount,
        status: "pendiente",
      },
    });
  },

  /**
   * Actualiza el estado del pago tras la respuesta de la pasarela.
   */
  async updateStatus(paymentId: string, status: PaymentStatus) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
  }
};