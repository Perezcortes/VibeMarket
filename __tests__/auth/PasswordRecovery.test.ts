import { PasswordRecoveryRepository } from "@/repositories/auth/PasswordRecovery.repository";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

describe("PasswordRecoveryRepository (US008-B)", () => {
  it("debe buscar al usuario por correo electrónico", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "123", email: "test@test.com" });
    await PasswordRecoveryRepository.findUserByEmail("test@test.com");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@test.com" } });
  });

  it("debe actualizar la contraseña del usuario", async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: "123" });
    await PasswordRecoveryRepository.updatePassword("123", "nuevoHashSeguro");
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: { password_hash: "nuevoHashSeguro" }
    });
  });
});