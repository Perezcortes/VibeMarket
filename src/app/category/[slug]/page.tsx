// src/app/category/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import NavbarUser from "@/components/NavbarUser";

// Definimos la interfaz para asegurar que params sea tratado como una promesa
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  // 1. Obtenemos la sesión y el slug en paralelo
  const [session, { slug }] = await Promise.all([
    getServerSession(authOptions),
    params
  ]);
  
  const user = session?.user;

  // 2. Consulta a MariaDB: Categoría y sus productos
  const categoryData = await prisma.category.findUnique({
    where: { 
      slug: slug 
    },
    include: {
      products: {
        where: {
          is_active: true
        },
        include: {
          images: true
        }
      }
    }
  });

  // 3. Manejo de error si no existe la categoría
  if (!categoryData) {
    notFound();
  }

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
              placeholder={`Buscar en ${categoryData.name}...`} 
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
          
          {/* Cabecera de Categoría */}
          <div className="mb-12">
            <Link 
              href="/" 
              className="text-primary font-bold flex items-center gap-2 mb-4 hover:underline transition-all"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Volver al inicio
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 capitalize tracking-tight">
              {categoryData.name}
            </h1>
            
            <p className="text-gray-500 mt-3 text-lg max-w-2xl font-medium">
              {categoryData.description || `Explora nuestra selección exclusiva de ${categoryData.name}.`}
            </p>
          </div>

          {/* Listado de Productos */}
          {categoryData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categoryData.products.map((product) => (
                <ProductCard 
                  key={product.id}
                  image={product.images[0]?.url || "shopping_bag"} 
                  title={product.name}
                  price={Number(product.price)} 
                  category={categoryData.name} 
                  tag={product.stock < 5 ? "¡Últimas piezas!" : undefined}
                />
              ))}
            </div>
          ) : (
            /* Estado Vacío */
            <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="material-symbols-outlined text-8xl text-gray-200 mb-6">
                inventory_2
              </span>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay productos aquí</h3>
              <p className="text-gray-500 text-lg max-w-md">
                Parece que aún no tenemos artículos disponibles en esta categoría. ¡Vuelve pronto!
              </p>
              <Link 
                href="/" 
                className="mt-8 bg-primary text-white px-10 py-4 rounded-full font-bold hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                Explorar otras ofertas
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#181111] text-white py-16 border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12 text-sm text-gray-400">
          <div>
            <h3 className="text-2xl font-black text-white mb-6">
              <span className="text-primary">Vibe</span>Market
            </h3>
            <p className="leading-relaxed">
              Descubre productos únicos y apoya a vendedores locales en Oaxaca de Juárez.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li><Link href="/search" className="hover:text-primary transition-colors">Tendencias</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Mi Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Soporte</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Ayuda</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Síguenos</h4>
            <div className="flex gap-4">
               {/* Aquí puedes agregar iconos de redes sociales */}
               <p>Conéctate con nosotros para ver las últimas novedades.</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-xs opacity-50">
          © 2026 VibeMarket. Oaxaca de Juárez, México.
        </div>
      </footer>
    </div>
  );
}