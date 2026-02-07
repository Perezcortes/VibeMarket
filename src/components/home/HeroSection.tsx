export default function HeroSection() {
  return (
    <header className="relative bg-black text-white overflow-hidden">
        {/* Fondo con Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-black opacity-90"></div>
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
          
          {/* Imagen Decorativa */}
          <div className="hidden md:flex justify-end animate-in slide-in-from-right duration-700">
            <div className="relative size-96 bg-white/10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl shadow-primary/30">
                <span className="material-symbols-outlined text-9xl text-white/50">shopping_bag</span>
                <div className="absolute -top-4 -right-4 bg-accent text-black p-4 rounded-2xl shadow-xl font-bold -rotate-6 animate-bounce delay-700">
                    -50% OFF
                </div>
            </div>
          </div>
        </div>
      </header>
  )
}