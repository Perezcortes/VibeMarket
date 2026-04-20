/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Logística / Reparto
 * Historia de Usuario: US016-F - Como repartidor, quiero subir una imagen de prueba del paquete entregado, para evitar problemas de entrega.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): Jose Alberto Perez Cortes
 * FECHA: 18 de marzo de 2026
 */


import { NextResponse } from "next/server";
import { PhotoEvidencyService } from "@/services/courier/evidency/photoEvidency.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const orderId = formData.get("orderId") as string;
    const file = formData.get("image") as File;

    if (!orderId || !file) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Convertimos el File a Buffer para tu Service
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear la instancia dentro de la función para que el mock funcione correctamente
    const evidencyService = new PhotoEvidencyService();
    const result = await evidencyService.uploadEvidency(orderId, buffer);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
