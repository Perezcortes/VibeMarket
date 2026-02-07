"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SellerDashboard({ user }: { user: any }) {
  const [view, setView] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0a0a] flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-[#1a1010] border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto z-20">
        
        {/* Logo del Dashboard */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-1">
            <span className="text-primary">Vibe</span>
            <span className="text-text-main dark:text-white">Seller</span>
            <span className="text-[10px] align-top bg-accent text-black px-1.5 rounded font-bold ml-1 shadow-sm">PRO</span>
          </h1>
        </div>
        
        {/* Navegación */}
        <nav className="p-4 space-y-2 flex-1">
            <SidebarItem 
                icon="dashboard" 
                label="Resumen General" 
                active={view === 'overview'} 
                onClick={() => setView('overview')} 
            />
            <SidebarItem 
                icon="inventory_2" 
                label="Catálogo & Stock" 
                active={view === 'catalog'} 
                onClick={() => setView('catalog')} 
            />
            <SidebarItem 
                icon="local_shipping" 
                label="Pedidos & Envíos" 
                badge="5" 
                active={view === 'orders'} 
                onClick={() => setView('orders')} 
            />
            <SidebarItem 
                icon="campaign" 
                label="Marketing" 
                active={view === 'marketing'} 
                onClick={() => setView('marketing')} 
            />
        </nav>

        {/* Footer Sidebar: Usuario + Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
            <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20">
                    {user?.name?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
            </div>
            
            <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm hover:shadow-md"
            >
                <span className="material-symbols-outlined text-lg">logout</span> 
                Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        
        {/* Header Superior */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Panel De Control</h2>
                <p className="text-gray-500 font-medium">Bienvenido de nuevo, aquí tienes tu resumen diario.</p>
            </div>
            <button className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/30 flex items-center gap-2 transition-transform active:scale-95 group">
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span> 
                Publicar Producto
            </button>
        </header>

        {/* VISTA: RESUMEN (OVERVIEW) */}
        {view === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 1. Tarjetas de Estadísticas (KPIs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        title="Ventas Hoy" 
                        value="$450.00" 
                        trend="+12%" 
                        color="bg-primary" 
                        icon="payments" 
                    />
                    <StatCard 
                        title="Visitas Tienda" 
                        value="1,203" 
                        trend="+5%" 
                        color="bg-secondary" 
                        icon="storefront" 
                    />
                    <StatCard 
                        title="Pedidos" 
                        value="12" 
                        sub="3 pendientes" 
                        color="bg-blue-500" 
                        icon="local_shipping" 
                    />
                    <StatCard 
                        title="Conversión" 
                        value="3.2%" 
                        trend="+0.4%" 
                        color="bg-green-500" 
                        icon="trending_up" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 2. Gráfico Principal (Simulado) */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1a1010] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between mb-6 items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                                Rendimiento de Ventas 
                                <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full uppercase">Sprint 2</span>
                            </h3>
                            <select className="bg-slate-50 border-none text-xs font-bold text-gray-500 rounded-lg py-1 px-2 outline-none cursor-pointer hover:bg-slate-100">
                                <option>Últimos 7 días</option>
                                <option>Este Mes</option>
                            </select>
                        </div>
                        {/* Gráfico de barras CSS puro */}
                        <div className="h-64 flex items-end justify-between gap-4 px-2 border-b border-gray-50 dark:border-gray-800 pb-2">
                            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((d, i) => (
                                <div key={d} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div 
                                            className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 group-hover:opacity-80 relative ${
                                                i === 1 ? 'bg-primary h-[70%]' : 
                                                i === 5 ? 'bg-secondary h-[85%]' : 
                                                'bg-gray-100 dark:bg-gray-800 h-[30%]'
                                            }`}
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                                                ${(i + 1) * 120}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-primary transition-colors">{d}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Categorías Top */}
                    <div className="bg-white dark:bg-[#1a1010] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                        <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Categorías Top</h3>
                        <div className="space-y-6 flex-1">
                            <CategoryBar label="Tecnología" percent="45%" width="45%" color="bg-secondary" />
                            <CategoryBar label="Moda" percent="30%" width="30%" color="bg-primary" />
                            <CategoryBar label="Hogar" percent="15%" width="15%" color="bg-accent" />
                        </div>
                        
                        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
                            <div className="flex gap-2 mb-2">
                                <span className="material-symbols-outlined text-accent text-sm">lightbulb</span>
                                <span className="text-xs font-bold text-gray-800 dark:text-white">Tip de Vendedor</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Las ventas de <strong>"Tecnología"</strong> suben los fines de semana. Crea un cupón flash para el Sábado.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* VISTAS PENDIENTES */}
        {view !== 'overview' && (
            <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-[#1a1010] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 animate-in zoom-in-95">
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-full mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">construction</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Módulo en Construcción</h3>
                <p className="text-gray-500">Pronto podrás gestionar <span className="font-bold text-primary capitalize">{view}</span> aquí.</p>
            </div>
        )}

      </main>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function SidebarItem({ icon, label, active, onClick, badge }: any) {
    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                ? "bg-red-50 dark:bg-red-900/20 text-primary font-bold shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
        >
            <span className={`material-symbols-outlined ${active ? "fill-1" : ""} group-hover:scale-110 transition-transform`}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
            {badge && <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</span>}
        </button>
    )
}

function StatCard({ title, value, trend, sub, color, icon }: any) {
    return (
        <div className={`${color} text-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-300`}>
            {/* Icono de Fondo */}
            <div className="absolute -right-2 -top-2 p-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12 group-hover:rotate-0 duration-500">
                <span className="material-symbols-outlined text-8xl">{icon}</span>
            </div>
            
            <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-2 flex items-center gap-2">
                    <span className="bg-white/20 p-1 rounded-md"><span className="material-symbols-outlined text-sm">{icon}</span></span>
                    {title}
                </p>
                <h3 className="text-3xl font-black mb-3 tracking-tight">{value}</h3>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                        {trend ? (
                            <>
                                <span className="material-symbols-outlined text-xs">trending_up</span> 
                                {trend}
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xs">pending</span> 
                                {sub}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CategoryBar({ label, percent, width, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                <span>{label}</span>
                <span className="text-gray-500">{percent}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: width }}></div>
            </div>
        </div>
    )
}