import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import NavbarUser from "@/components/NavbarUser"; 

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-text-main">
      
      {/* --- NAVBAR (Fijo y Estilizado) --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-primary">Vibe</span>
            <span className="text-text-main dark:text-white">Market</span>
          </Link>

          {/* Buscador Central (Oculto en móvil) */}
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
            <Link href="/cart" className="relative group">
              <span className="material-symbols-outlined text-2xl text-gray-600 group-hover:text-primary transition-colors">shopping_cart</span>
              {/* Badge de carrito simulado */}
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">2</span>
            </Link>

            {/* AQUÍ INTEGRAMOS EL COMPONENTE DE USUARIO INTELIGENTE  */}
            <NavbarUser user={user} />
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative bg-black text-white overflow-hidden">
        {/* Fondo con Gradiente Vibe */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-black opacity-90"></div>
        {/* Patrón decorativo opcional */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in slide-in-from-left duration-700">
            <span className="bg-accent text-black px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider shadow-lg">Ofertas de Temporada</span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight drop-shadow-lg">
              Tu estilo,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">tu mercado.</span>
            </h1>
            <p className="text-lg text-white/90 max-w-md font-medium">
              Descubre miles de productos únicos de vendedores locales o crea tu propia tienda hoy mismo.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl active:scale-95 transform duration-150">
                Ver Ofertas
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors backdrop-blur-sm active:scale-95 transform duration-150">
                Vender Ahora
              </button>
            </div>
          </div>
          
          {/* Imagen Hero (Decorativa / Flotante) */}
          <div className="hidden md:flex justify-end animate-in slide-in-from-right duration-700">
            <div className="relative size-96 bg-white/10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl shadow-primary/30">
                <span className="material-symbols-outlined text-9xl text-white/50">shopping_bag</span>
                
                {/* Etiquetas Flotantes */}
                <div className="absolute -top-4 -right-4 bg-accent text-black p-4 rounded-2xl shadow-xl font-bold -rotate-6 animate-bounce delay-700">
                    -50% OFF
                </div>
                <div className="absolute bottom-10 -left-10 bg-white text-black p-4 rounded-2xl shadow-xl flex items-center gap-3 rotate-3">
                    <div className="size-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold">Envío Gratis</p>
                        <p className="text-sm font-black">En 24 horas</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- CATEGORÍAS --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-2 text-gray-800">
            <span className="material-symbols-outlined text-primary">category</span>
            Explora por Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {['Tecnología', 'Moda', 'Hogar', 'Deportes', 'Juguetes', 'Mascotas'].map((cat, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-slate-50 group-hover:bg-primary/5 border border-gray-100 group-hover:border-primary transition-all rounded-2xl p-6 flex flex-col items-center gap-3 text-center h-full justify-center shadow-sm hover:shadow-md">
                   <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary transition-colors transform group-hover:scale-110 duration-200">
                     {['devices', 'styler', 'chair', 'fitness_center', 'toys', 'pets'][i]}
                   </span>
                   <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">{cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS (Mockup) --- */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-black mb-2 text-gray-900">Tendencias</h2>
                <p className="text-gray-500 font-medium">Lo más vendido de la semana.</p>
            </div>
            <Link href="/search" className="text-primary font-bold hover:underline flex items-center gap-1 group">
                Ver todo <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard 
              image="headphones" 
              title="Audífonos Pro Max" 
              price={299.00} 
              category="Audio" 
              tag="Nuevo"
            />
            <ProductCard 
              image="watch" 
              title="Smartwatch Series 7" 
              price={159.50} 
              category="Wearables" 
              discount="-20%"
            />
             <ProductCard 
              image="shoes" 
              title="Nike Air Runner" 
              price={89.99} 
              category="Moda" 
            />
             <ProductCard 
              image="backpack" 
              title="Mochila Antirrobo" 
              price={45.00} 
              category="Accesorios" 
              tag="Hot"
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#181111] text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
            <div>
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-1">
                    <span className="text-primary">Vibe</span>Market
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    La plataforma de comercio electrónico diseñada para conectar pasiones. Compra seguro, vende rápido y crece con nosotros.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-lg">Comprar</h4>
                <ul className="space-y-3 text-gray-400 text-sm font-medium">
                    <li><a href="#" className="hover:text-primary transition-colors">Tendencias</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Ofertas Flash</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Categorías</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-lg">Soporte</h4>
                <ul className="space-y-3 text-gray-400 text-sm font-medium">
                    <li><a href="#" className="hover:text-primary transition-colors">Centro de Ayuda</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Mis Pedidos</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Devoluciones</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-lg">Legal</h4>
                <ul className="space-y-3 text-gray-400 text-sm font-medium">
                    <li><a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-xs font-medium">
            © 2026 VibeMarket Inc. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}

// --- SUBCOMPONENTE DE TARJETA DE PRODUCTO ---
function ProductCard({ image, title, price, category, tag, discount }: any) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-gray-100 relative cursor-pointer">
            {/* Etiquetas Flotantes */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {tag && <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-md">{tag}</span>}
                {discount && <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">{discount}</span>}
            </div>
            
            {/* Imagen Simulada */}
            <div className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-slate-100 transition-colors relative overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-gray-300 group-hover:scale-110 transition-transform duration-300">{image}</span>
                
                {/* Botón Añadir Rápido (Aparece en Hover) */}
                <button className="absolute bottom-4 right-4 bg-white text-black size-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white">
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
            </div>

            {/* Info */}
            <div>
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">{category}</p>
                <h3 className="font-bold text-gray-800 mb-2 truncate text-base">{title}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-primary">${price.toFixed(2)}</span>
                    <div className="flex text-accent text-sm gap-0.5">
                        <span className="material-symbols-outlined text-base">star</span>
                        <span className="material-symbols-outlined text-base">star</span>
                        <span className="material-symbols-outlined text-base">star</span>
                        <span className="material-symbols-outlined text-base">star</span>
                        <span className="material-symbols-outlined text-base text-gray-200">star</span>
                    </div>
                </div>
            </div>
        </div>
    )
}