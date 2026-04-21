import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CartPersistenceService } from "@/services/seller/shoppingCart/SaveCart.service";
import { CartPersistenceRepository } from "@/repositories/seller/shopingCart/SaveCart.repository";
import CartItem from "@/components/cart/CartItem";
import Link from "next/link";
import CartSummary from "@/components/cart/CartSummary";

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="container mx-auto p-20 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">account_circle</span>
        <h1 className="text-2xl font-bold text-gray-800">Inicia sesión para ver tu carrito</h1>
        <Link href="/login" className="mt-4 inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold">
          Ir al Login
        </Link>
      </div>
    );
  }

  const service = new CartPersistenceService(CartPersistenceRepository);
  const cart = await service.getCartContent(session.user.id);

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-black text-gray-900">Mi Carrito</h1>
        <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
          {cart?.items.length || 0} productos
        </span>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-300 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">shopping_cart_off</span>
          <p className="text-xl font-bold text-gray-400">Tu carrito está vacío</p>
          <Link href="/search" className="mt-6 inline-block text-primary font-bold hover:underline">
            Explorar catálogo →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LISTA DE PRODUCTOS (US011-D, B, C) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.items.map((item: any) => (
              <CartItem key={item.cartItemId} item={item} />
            ))}
          </div>

          {/* RESUMEN DE COMPRA (Inicia US012-A / US012-G) */}
          <div className="lg:col-span-1">
             <CartSummary cart={cart} />
          </div>
          
        </div>
      )}
    </div>
  );
}