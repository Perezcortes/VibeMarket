"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#181111] text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* --- COLUMNA 1: MARCA Y MISIÓN --- */}
        <div>
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-1">
            <span className="text-red-600">Vibe</span>Market
          </h3>
          <p className="text-gray-400 text-[13px] leading-relaxed mb-6">
            La plataforma de comercio electrónico diseñada para conectar pasiones. Compra seguro, vende rápido y crece con nosotros.
          </p>
          <div className="flex gap-4">
            <button className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-sm" suppressHydrationWarning>public</span>
            </button>
            <button className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-sm" suppressHydrationWarning>alternate_email</span>
            </button>
            <button className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-sm" suppressHydrationWarning>chat</span>
            </button>
          </div>
        </div>

        {/* --- COLUMNA 2: COMPRAR --- */}
        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Comprar</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li>
                <Link href="/search" className="hover:text-red-500 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs" suppressHydrationWarning>chevron_right</span> Tendencias
                </Link>
            </li>
            <li>
                <Link href="/search?q=ofertas" className="hover:text-red-500 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs" suppressHydrationWarning>chevron_right</span> Ofertas Flash
                </Link>
            </li>
            <li>
                <Link href="/search" className="hover:text-red-500 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs" suppressHydrationWarning>chevron_right</span> Categorías
                </Link>
            </li>
            <li>
                <Link href="/register?role=vendedor" className="hover:text-red-600 transition-colors flex items-center gap-2 text-red-600 font-bold">
                    <span className="material-symbols-outlined text-xs" suppressHydrationWarning>store</span> Vender aquí
                </Link>
            </li>
          </ul>
        </div>

        {/* --- COLUMNA 3: SOPORTE (RUTAS ACTUALIZADAS SEGÚN TU IMAGEN) --- */}
        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Soporte</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li>
                {/* Ruta: src/app/api/support/help-center/page.tsx */}
                <Link href="/api/support/help-center" className="hover:text-red-500 transition-colors">Centro de Ayuda</Link>
            </li>
            <li>
                {/* Ruta: src/app/dashboard/buyer/page.tsx */}
                <Link href="/dashboard/buyer" className="hover:text-red-500 transition-colors">Mis Pedidos</Link>
            </li>
            <li>
                {/* Ruta: src/app/api/support/returns/page.tsx */}
                <Link href="/api/support/returns" className="hover:text-red-500 transition-colors">Política de Devoluciones</Link>
            </li>
            <li>
                {/* Ruta: src/app/api/support/contact/page.tsx */}
                <Link href="/api/support/contact" className="hover:text-red-500 transition-colors">Contáctanos</Link>
            </li>
          </ul>
        </div>

        {/* --- COLUMNA 4: LEGAL --- */}
        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Legal</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li>
                <Link href="#" className="hover:text-red-500 transition-colors">Términos y Condiciones</Link>
            </li>
            <li>
                <Link href="#" className="hover:text-red-500 transition-colors">Privacidad</Link>
            </li>
            <li>
                <Link href="#" className="hover:text-red-500 transition-colors">Cookies</Link>
            </li>
            <li>
                <Link href="#" className="hover:text-red-500 transition-colors">Sobre Nosotros</Link>
            </li>
          </ul>
        </div>

      </div>

      {/* --- BARRA INFERIOR --- */}
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
          © 2026 VibeMarket Inc.
        </div>
        
        <div className="flex items-center gap-3 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="bg-white text-black px-2 py-0.5 rounded text-[9px] font-black border-b-2 border-red-600">VISA</span>
            <span className="bg-white text-black px-2 py-0.5 rounded text-[9px] font-black border-b-2 border-red-600">MC</span>
            <span className="bg-white text-black px-2 py-0.5 rounded text-[9px] font-black border-b-2 border-red-600">PP</span>
        </div>
      </div>
    </footer>
  );
}