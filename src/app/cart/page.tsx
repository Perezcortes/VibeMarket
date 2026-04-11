import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CartPersistenceService } from "@/services/seller/shoppingCart/SaveCart.service";
import { CartPersistenceRepository } from "@/repositories/seller/shopingCart/SaveCart.repository";
import CartItem from "@/components/cart/CartItem";
import Link from "next/link"; 

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
          
          {/* RESUMEN DE COMPRA (Inicia US012-A) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 h-fit shadow-xl sticky top-24">
               <h2 className="text-2xl font-black mb-6 text-gray-800">Resumen</h2>
               
               <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-gray-500 font-medium">
                   <span>Subtotal</span>
                   <span>${cart.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-500 font-medium">
                   <span>Envío</span>
                   <span className="text-green-500 font-bold">Gratis</span>
                 </div>
               </div>

               <div className="flex justify-between items-end font-black text-3xl border-t border-gray-100 pt-6 mb-8 text-gray-900">
                 <div className="flex flex-col">
                   <span className="text-xs uppercase text-gray-400 tracking-widest mb-1">Total a pagar</span>
                   <span>Total</span>
                 </div>
                 <span className="text-primary">${cart.totalAmount.toFixed(2)}</span>
               </div>

               {/* DISPARADOR DEL CHECKOUT (US012-A) */}
               <Link 
                 href="/checkout/payment" 
                 className="w-full bg-primary text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95 text-center"
               >
                 <span className="material-symbols-outlined">payments</span>
                 Finalizar Compra
               </Link>

               <p className="text-center text-gray-400 text-[10px] mt-4 uppercase font-bold tracking-tighter">
                 Pago 100% Seguro en VibeMarket
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}