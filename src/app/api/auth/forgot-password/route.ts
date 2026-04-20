/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Presentación / API - ADMINISTRACIÓN Y SEGURIDAD
 * Historia de Usuario: US008-B - Recuperación de contraseña por email
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 24/03/2026
 */

import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth/authService";

export async function POST(request: Request) {
  try {
    // 1. Recibir el correo desde el frontend
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "El correo es requerido" }, { status: 400 });
    }

    // 2. Llamar a tu capa de servicio (la que hiciste en el Sprint 4)
    const result = await AuthService.initiatePasswordRecovery(email);

    // 3. Responder al frontend con éxito
    return NextResponse.json({ message: result.message }, { status: 200 });

  } catch (error: any) {
    // Regla LEAN de seguridad: Si falla (por ejemplo, correo no existe), 
    // devolvemos el mensaje ambiguo que definiste en tu servicio.
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}