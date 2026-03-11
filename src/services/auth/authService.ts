/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Servicios - ADMINISTRACIÓN Y SEGURIDAD
 * Historia de Usuario: US008-B - Recuperación de contraseña por email
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 10/03/2026
 */

import { PasswordRecoveryRepository } from "@/repositories/auth/PasswordRecovery.repository";

export const AuthService = {
  // US008-B: Solicitud de recuperación de contraseña
  async initiatePasswordRecovery(email: string) {
    const user = await PasswordRecoveryRepository.findUserByEmail(email);
    
    if (!user) {
      // Regla de negocio de seguridad: Mensaje ambiguo para no revelar correos registrados
      throw new Error("Si el correo existe, recibirás un enlace de recuperación."); 
    }

    // Generar token JWT y enviar email
    return { success: true, message: "Correo de recuperación procesado." };
  },

  // US008-B: Confirmación de cambio de contraseña
  async resetPassword(userId: string, newPassword: string) {
    // Encriptar el newPassword con bcrypt
    const simulatedHash = `hashed_${newPassword}`; 
    
    await PasswordRecoveryRepository.updatePassword(userId, simulatedHash);
    return { success: true, message: "Contraseña actualizada exitosamente." };
  }
};