import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, full_name, role } = data;

    // 1. Validar que el usuario no exista
    const userFound = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userFound) {
      return NextResponse.json(
        { message: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        full_name,
        password_hash: hashedPassword,
        role: role || 'comprador', // Por defecto comprador
      },
    });

    // Quitamos el password de la respuesta por seguridad
    const { password_hash: _, ...userWithoutPass } = newUser;

    return NextResponse.json(userWithoutPass);
  } catch (error) {
    return NextResponse.json(
      { message: "Error en el servidor", error },
      { status: 500 }
    );
  }
}