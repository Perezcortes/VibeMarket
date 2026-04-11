/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Lógistica / Reparto
 * Historia de Usuario: US016-E: Como repartidor, quiero actualizar 
 * el estatus del pedido, para asegurar el proceso.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): Jose Perez cortes
 * FECHA: 10 de Abril de 2026
 */
import { NextResponse } from "next/server";
import { ActualizarEstatusService } from "@/services/courier/delivery/actualizarEstatus.service";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, nuevoEstatus, repartidorId } = body;

    // 2. Validamos que no nos manden datos vacíos
    if (!orderId || !nuevoEstatus) {
      return NextResponse.json(
        { error: "Faltan datos: Se requiere el ID del pedido y el nuevo estatus." }, 
        { status: 400 }
      );
    }

    // 3. Llamamos a tu servicio "cerebro" para que haga la magia en la Base de Datos
    const resultado = await ActualizarEstatusService.prototype.updateOrderStatus(orderId, nuevoEstatus);

    // 4. Le respondemos al frontend que todo salió bien
    return NextResponse.json(
      { success: true, message: "Estatus actualizado correctamente", data: resultado }, 
      { status: 200 }
    );

  } catch (error: any) {
    // 5. Si algo explota, capturamos el error
    return NextResponse.json(
      { error: error.message || "Error interno del servidor al actualizar el estatus." }, 
      { status: 500 }
    );
  }
}