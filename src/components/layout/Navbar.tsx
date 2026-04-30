import Link from "next/link";
import NavbarUser from "@/components/NavbarUser"; 
import { CartPersistenceService } from "@/services/seller/shoppingCart/SaveCart.service";
import { CartPersistenceRepository } from "@/repositories/seller/shopingCart/SaveCart.repository";

export default async function Navbar({ user }: { user: any }) {
  
  // US011-D: Lógica para contar productos diferentes
  let distinctItemsCount = 0;

  if (user?.id) {
    try {
      const cartService = new CartPersistenceService(CartPersistenceRepository);
      const cart = await cartService.getCartContent(user.id);
      
      // Contamos cuántos productos diferentes (filas en cart_items) hay
      distinctItemsCount = cart?.items?.length || 0;
    } catch (error) {
      console.error("Error al recuperar el conteo del carrito:", error);
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 hover:opacity-80 transition-opacity">
          <span className="text-primary">Vibe</span>
          <span className="text-text-main dark:text-white">Market</span>
        </Link>

        {/* Buscador */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <input 
            type="text" 
            placeholder="Buscar productos, marcas y más..." 
            className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-sm font-medium"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        </div>

        {/* Menú Derecha */}
        <div className="flex items-center gap-6">
          {/* Devoluciones */}
          <Link href="/dashboard/buyer/returns" className="relative group">
            <span className="material-symbols-outlined text-2xl text-gray-600 group-hover:text-primary transition-colors">assignment_return</span>
          </Link>

          <Link href="/cart" className="relative group">
            <span className="material-symbols-outlined text-2xl text-gray-600 group-hover:text-primary transition-colors">shopping_cart</span>
            
            {/* US011-D: Solo se muestra si el conteo es mayor a 0 */}
            {distinctItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                {distinctItemsCount}
              </span>
            )}
          </Link>

          <NavbarUser user={user} />
        </div>
      </div>
    </nav>
  );
}