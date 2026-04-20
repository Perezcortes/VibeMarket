import { NextResponse } from "next/server";
import { ValidaCuponService } from "@/services/buyer/cupon/validaCupon.service";

export async function POST(req: Request) {
    try {
        const { code, cartProductIds } = await req.json();

        // Instanciamos y usamos tu servicio
        const service = new ValidaCuponService();
        const result = await service.validateCouponForCart(code, cartProductIds);

        return NextResponse.json(result);

    } catch (error: any) {
        // Atrapamos los errores lanzados por el `throw new Error()` del servicio
        console.error("Error en validación de cupón:", error.message);
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 400 });
    }
}