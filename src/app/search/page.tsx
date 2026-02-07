// app/search/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import NavbarUser from "@/components/NavbarUser";

export default async function AllProductsPage() {
  // Obtenemos la sesión del usuario y los productos en paralelo
  const [session, products] = await Promise.all([
    getServerSession(authOptions),
    prisma.product.findMany({
      where: { 
        is_active: true 
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        id: 'desc' // Los más nuevos primero
      }
    })
  ]);

  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-text-main">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-primary">Vibe</span>
            <span className="text-text-main">Market</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="Buscar productos, marcas y más..." 
              className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-sm font-medium"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative group">
              <span className="material-symbols-outlined text-2xl text-gray-600 group-hover:text-primary transition-colors">shopping_cart</span>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">2</span>
            </Link>
            <NavbarUser user={user} />
          </div>
        </div>
      </nav>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          
          {/* Encabezado */}
          <div className="mb-12">
            <Link href="/" className="text-primary font-bold flex items-center gap-2 mb-4 hover:underline transition-all">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Volver al inicio
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Catálogo Completo</h1>
            <p className="text-gray-500 mt-3 text-lg font-medium">
              Explora nuestra selección de {products.length} productos disponibles actualmente.
            </p>
          </div>

          {/* Grid de Productos Global */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  image={product.images[0]?.url || "shopping_bag"} 
                  title={product.name}
                  price={Number(product.price)} 
                  category={product.category?.name || "General"} 
                  tag={product.stock < 5 ? "¡Últimas piezas!" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="material-symbols-outlined text-8xl text-gray-200 mb-6">search_off</span>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No encontramos nada</h3>
              <p className="text-gray-500 text-lg max-w-md font-medium">
                Parece que nuestro inventario está vacío por ahora. ¡Vuelve pronto para ver novedades!
              </p>
              <Link 
                href="/" 
                className="mt-8 bg-primary text-white px-10 py-4 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Ir al inicio
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#181111] text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12 text-sm text-gray-400">
          <div>
            <h3 className="text-2xl font-black text-white mb-6">
              <span className="text-primary">Vibe</span>Market
            </h3>
            <p className="leading-relaxed">
              Tu destino favorito en Oaxaca para encontrar productos increíbles con envío seguro.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Navegación</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors text-primary font-bold">Todos los Productos</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Mi Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Vendedores</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-primary transition-colors">Vender en VibeMarket</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Políticas de Venta</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Ayuda</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Soporte</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-xs opacity-50">
          © 2026 VibeMarket. Oaxaca de Juárez, México.
        </div>
      </footer>
    </div>
  );
}