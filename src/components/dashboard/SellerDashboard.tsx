"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import CatalogManager from "@/components/dashboard/seller/CatalogManager";

export default function SellerDashboard({ user }: { user: any }) {
  const [view, setView] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0a0a] flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-[#1a1010] border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto z-20">
         
         {/* Logo */}
         <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-gray-800">
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-1">
               <span className="text-primary">Vibe</span>
               <span className="text-text-main dark:text-white">Seller</span>
            </h1>
         </div>

         {/* Navegación */}
         <nav className="p-4 space-y-2 flex-1">
            <SidebarItem 
                icon="dashboard" 
                label="Resumen" 
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
                label="Pedidos" 
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

         {/* --- FOOTER DEL SIDEBAR (PERFIL + LOGOUT) --- */}
         <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
            
            {/* Perfil de Usuario */}
            <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 text-sm">
                    {/* Inicial del usuario o 'V' si no hay nombre */}
                    {user?.name?.charAt(0).toUpperCase() || "V"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                        {user?.name || "Vendedor"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                        {user?.role || "Panel Vendedor"}
                    </p>
                </div>
            </div>

            {/* Botón Cerrar Sesión */}
            <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-xl transition-all text-xs font-bold shadow-sm hover:shadow-md group"
            >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">logout</span> 
                Cerrar Sesión
            </button>
         </div>

      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {view === 'catalog' ? 'Gestión de Productos' : 'Panel de Control'}
                </h2>
                <p className="text-gray-500 font-medium">Hola {user?.name?.split(' ')[0]}, administra tu tienda aquí.</p>
            </div>
        </header>

        {/* --- VISTAS --- */}
        
        {/* 1. Resumen */}
        {view === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-primary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                        <h3 className="text-sm font-bold opacity-80 mb-2">Ventas Totales</h3>
                        <p className="text-4xl font-black">$12,450</p>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12">payments</span>
                     </div>
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <h3 className="text-sm font-bold text-gray-500 mb-2">Pedidos Pendientes</h3>
                        <p className="text-4xl font-black text-gray-800">5</p>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-gray-100 rotate-12">local_shipping</span>
                     </div>
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <h3 className="text-sm font-bold text-gray-500 mb-2">Productos Activos</h3>
                        <p className="text-4xl font-black text-gray-800">24</p>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-gray-100 rotate-12">inventory_2</span>
                     </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-lg mb-4">Rendimiento Reciente</h3>
                    <div className="h-40 bg-slate-50 rounded-xl flex items-center justify-center text-gray-400">
                        Gráfico de ventas (Simulado)
                    </div>
                </div>
            </div>
        )}

        {/* 2. Catálogo (COMPONENTE IMPORTADO) */}
        {view === 'catalog' && (
            <CatalogManager />
        )}

        {/* 3. Placeholder */}
        {(view !== 'overview' && view !== 'catalog') && (
            <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-[#1a1010] rounded-3xl border-2 border-dashed border-gray-200">
                <span className="material-symbols-outlined text-4xl text-gray-400">construction</span>
                <p className="text-gray-500 mt-2">Módulo {view} en construcción.</p>
            </div>
        )}

      </main>
    </div>
  );
}

// Subcomponente de Botón Sidebar
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