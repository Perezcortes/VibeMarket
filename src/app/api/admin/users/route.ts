import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";

// GET: Obtener todos los usuarios
export async function GET() {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      is_active: true,
    },
    orderBy: { 
        full_name: 'asc' 
    } 
  });

  return NextResponse.json(users);
}

// POST: Crear nuevo usuario
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { full_name, email, password, role } = data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "El correo ya existe" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      full_name,
      email,
      password_hash: hashedPassword,
      role,
      is_active: true
    }
  });

  return NextResponse.json(newUser);
}

// PUT: Actualizar usuario
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { id, full_name, email, role, is_active } = data;

  const isActiveBoolean = String(is_active) === "true";

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { 
        full_name, 
        email, 
        role, 
        is_active: isActiveBoolean 
    }
  });

  return NextResponse.json(updatedUser);
}

// DELETE: Eliminar usuario
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}