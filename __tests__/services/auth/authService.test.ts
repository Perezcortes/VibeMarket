/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 2 - Administración y Seguridad
 * Historia de Usuario: US008-B Recuperación de contraseña por email
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 10/03/2026
 */

import { AuthService } from "@/services/auth/authService";
import { PasswordRecoveryRepository } from "@/repositories/auth/PasswordRecovery.repository";

jest.mock("@/repositories/auth/PasswordRecovery.repository");

describe("US008-B: Pruebas Unitarias - Capa de Servicio", () => {
  it("Debe iniciar el proceso de recuperación exitosamente si el correo existe", async () => {
    (PasswordRecoveryRepository.findUserByEmail as jest.Mock).mockResolvedValue({ id: "user_123", email: "test@test.com" });
    const result = await AuthService.initiatePasswordRecovery("test@test.com");
    expect(result.success).toBe(true);
  });

  it("Debe lanzar un error de seguridad genérico si el correo no está registrado", async () => {
    (PasswordRecoveryRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.initiatePasswordRecovery("noexiste@test.com"))
      .rejects.toThrow("Si el correo existe, recibirás un enlace de recuperación.");
  });
});