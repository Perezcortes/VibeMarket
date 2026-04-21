import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    
    // ✨ 1. ATRAPAMOS EL TOTAL CON DESCUENTO AQUÍ
    const { 
      userId, method, street, exterior_number, neighborhood, 
      city, state, postal_code, totalACobrar 
    } = body;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear dirección
      const fullStreet = `${street} #${exterior_number}, Col. ${neighborhood}`;
      const newAddress = await tx.address.create({
        data: {
          user_id: userId,
          street: fullStreet,
          city,
          state,
          postal_code,
          country: "México"
        }
      });

      // 2. Obtener el carrito con los precios originales
      const cart = await tx.cart.findUnique({
        where: { user_id: userId },
        include: { items: { include: { product: true } } }
      });

      if (!cart || cart.items.length === 0) throw new Error("Carrito vacío");

      // 3. Calcular total original (por si acaso no viene el descuento)
      const totalOriginal = cart.items.reduce((acc, item) => {
        const price = Number(item.product.price);
        return acc + (price * item.quantity);
      }, 0);

      // ✨ 2. LA MAGIA: Si el frontend nos mandó un total con descuento, usamos ese. 
      // Si no, usamos el original que calculamos arriba.
      const finalTotal = totalACobrar ? Number(totalACobrar) : totalOriginal;

      // 4. Crear la Orden (HU019/US012-B)
      const newOrder = await tx.order.create({
        data: {
          buyer_id: userId,
          address_id: newAddress.id,
          total_amount: new Prisma.Decimal(finalTotal), // ✨ GUARDAMOS EL TOTAL CON DESCUENTO
          status: 'pendiente',
          items: {
            create: cart.items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.product.price 
            }))
          },
          payments: {
            create: {
              provider: method || "card",
              amount: new Prisma.Decimal(finalTotal), // ✨ LE COBRAMOS EL TOTAL CON DESCUENTO
              status: "aprobado" as any
            }
          }
        }
      });

      // 5. Limpiar carrito
      await tx.cartItem.deleteMany({ where: { cart_id: cart.id } });

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: result.id });

  } catch (error: any) {
    console.error("DETALLE DEL ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}