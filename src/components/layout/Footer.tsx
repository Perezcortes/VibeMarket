import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#181111] text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* --- COLUMNA 1: MARCA Y MISIÓN --- */}
        <div>
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-1">
            <span className="text-primary">Vibe</span>Market
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            La plataforma de comercio electrónico diseñada para conectar pasiones. Compra seguro, vende rápido y crece con nosotros.
          </p>
          {/* Redes Sociales Simuladas */}
          <div className="flex gap-4">
            <button className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">public</span>
            </button>
            <button className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
            </button>
            <button className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">chat</span>
            </button>
          </div>
        </div>

        {/* --- COLUMNA 2: COMPRAR --- */}
        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Comprar</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li>
                <Link href="/search" className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">chevron_right</span> Tendencias
                </Link>
            </li>
            <li>
                <Link href="/search?q=ofertas" className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">chevron_right</span> Ofertas Flash
                </Link>
            </li>
            <li>
                <Link href="/search" className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">chevron_right</span> Todas las Categorías
                </Link>
            </li>
            <li>
                <Link href="/register?role=vendedor" className="hover:text-primary transition-colors flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-xs">store</span> Vender en VibeMarket
                </Link>
            </li>
          </ul>
        </div>

        {/* --- COLUMNA 3: SOPORTE --- */}
        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Soporte</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li>
                <Link href="/dashboard/support" className="hover:text-primary transition-colors">Centro de Ayuda</Link>
            </li>
            <li>
                <Link href="/orders" className="hover:text-primary transition-colors">Mis Pedidos</Link>
            </li>
            <li>
                <Link href="/returns" className="hover:text-primary transition-colors">Política de Devoluciones</Link>
            </li>
            <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contáctanos</Link>
            </li>
          </ul>
        </div>

        {/* --- COLUMNA 4: LEGAL --- */}
        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Legal</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li>
                <Link href="/terms" className="hover:text-primary transition-colors">Términos y Condiciones</Link>
            </li>
            <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">Política de Privacidad</Link>
            </li>
            <li>
                <Link href="/cookies" className="hover:text-primary transition-colors">Uso de Cookies</Link>
            </li>
            <li>
                <Link href="/about" className="hover:text-primary transition-colors">Sobre Nosotros</Link>
            </li>
          </ul>
        </div>

      </div>

      {/* --- BARRA INFERIOR --- */}
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-500 text-xs font-medium text-center md:text-left">
          © 2026 VibeMarket Inc. Todos los derechos reservados.
        </div>
        
        {/* Métodos de pago simulados (Iconos de texto) */}
        <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="bg-white text-black px-2 py-1 rounded text-[10px] font-bold">VISA</span>
            <span className="bg-white text-black px-2 py-1 rounded text-[10px] font-bold">MasterCard</span>
            <span className="bg-white text-black px-2 py-1 rounded text-[10px] font-bold">PayPal</span>
        </div>
      </div>
    </footer>
  );
}