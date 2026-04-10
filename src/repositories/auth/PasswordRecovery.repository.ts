import { prisma } from "@/lib/prisma";

/**
 * US008-B: Recuperación de contraseña por email.
 * "Como usuario quiero cambiar mi contraseña a través de mi correo..."
 */
export const PasswordRecoveryRepository = {
  /**
   * Verifica si el correo existe en la base de datos.
   */
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  /**
   * Actualiza el hash de la contraseña una vez que el usuario validó su token/email.
   */
  async updatePassword(userId: string, newPasswordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash }
    });
  }
};