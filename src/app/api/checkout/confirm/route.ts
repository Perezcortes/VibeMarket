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
    const { userId, method, street, exterior_number, neighborhood, city, state, postal_code } = body;

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

      // 3. Calcular total (Convertimos a Number para asegurar precisión en JS antes de pasar a Prisma)
      const totalAmount = cart.items.reduce((acc, item) => {
        const price = Number(item.product.price);
        return acc + (price * item.quantity);
      }, 0);

      // 4. Crear la Orden (HU019/US012-B)
      // NOTA: Usamos los valores directamente, Prisma se encargará del cast 
      // si los nombres de las propiedades coinciden con el esquema.
      const newOrder = await tx.order.create({
        data: {
          buyer_id: userId,
          address_id: newAddress.id,
          total_amount: new Prisma.Decimal(totalAmount), // Envolvemos el total
          status: 'pendiente',
          items: {
            create: cart.items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              // IMPORTANTE: Asegúrate de que item.product.price sea un Decimal válido de Prisma
              unit_price: item.product.price 
            }))
          },
          payments: {
            create: {
              provider: method || "card",
              amount: new Prisma.Decimal(totalAmount),
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