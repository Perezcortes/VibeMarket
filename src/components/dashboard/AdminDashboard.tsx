"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AdminDashboard({ user }: { user: any }) {
  const [view, setView] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* SIDEBAR DE CONTROL ABSOLUTO (Oscuro) */}
      <aside className="w-64 bg-[#1a1010] text-white flex flex-col h-screen sticky top-0 overflow-y-auto">
        
        {/* Header del Sidebar */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <h1 className="text-xl font-black tracking-tighter text-white">
            Vibe<span className="text-primary">Admin</span>
          </h1>
        </div>
        
        {/* Navegación */}
        <nav className="p-4 space-y-6 flex-1">
            
            {/* Sección General */}
            <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-4 tracking-wider">General</p>
                <div className="space-y-1">
                    <SidebarItem icon="dashboard" label="Resumen Global" active={view === 'overview'} onClick={() => setView('overview')} />
                    <SidebarItem icon="group" label="Usuarios y Roles" active={view === 'users'} onClick={() => setView('users')} />
                </div>
            </div>

            {/* Módulo Marketplace */}
            <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-4 tracking-wider">Marketplace</p>
                <div className="space-y-1">
                    <SidebarItem icon="inventory_2" label="Catálogo Maestro" active={view === 'products'} onClick={() => setView('products')} />
                    <SidebarItem icon="receipt_long" label="Todas las Órdenes" active={view === 'orders'} onClick={() => setView('orders')} />
                    <SidebarItem icon="payments" label="Finanzas & Comisiones" active={view === 'finance'} onClick={() => setView('finance')} />
                </div>
            </div>

            {/* Módulo Logística */}
            <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-4 tracking-wider">Logística</p>
                <div className="space-y-1">
                    <SidebarItem icon="local_shipping" label="Gestión de Rutas" active={view === 'logistics'} onClick={() => setView('logistics')} />
                    <SidebarItem icon="map" label="Zonas de Cobertura" active={view === 'coverage'} onClick={() => setView('coverage')} />
                </div>
            </div>

             {/* Módulo Soporte */}
             <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-4 tracking-wider">Atención</p>
                <div className="space-y-1">
                    <SidebarItem icon="confirmation_number" label="Centro de Tickets" active={view === 'tickets'} onClick={() => setView('tickets')} />
                    <SidebarItem icon="settings" label="Configuración" active={view === 'settings'} onClick={() => setView('settings')} />
                </div>
            </div>
        </nav>

        {/* Footer del Sidebar: Perfil y Logout */}
        <div className="p-4 border-t border-gray-800 bg-[#150d0d]">
             <div className="flex items-center gap-3 mb-4">
                <div className="size-9 rounded-full bg-primary flex items-center justify-center font-bold text-xs shadow-lg shadow-primary/20">
                    AD
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">Administrador</p>
                    <p className="text-xs text-gray-500">Control Total</p>
                </div>
            </div>

            <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="w-full flex items-center justify-center gap-2 bg-white/5 text-gray-300 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs font-bold border border-white/5 hover:border-transparent group"
            >
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">logout</span> 
                Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-black text-gray-800">
                    {view === 'overview' && 'Visión Global'}
                    {view === 'users' && 'Gestión de Usuarios'}
                    {view === 'products' && 'Catálogo Maestro'}
                    {view === 'orders' && 'Historial de Órdenes'}
                    {/* Fallback para otros títulos */}
                    {!['overview', 'users', 'products', 'orders'].includes(view) && 'Panel de Administración'}
                </h2>
                <p className="text-gray-500 mt-1">
                    Hola {user?.name}, tienes el control total de la plataforma.
                </p>
            </div>
            <div className="text-sm font-bold text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-200">
                v1.0.0 (Beta)
            </div>
        </header>

        {/* VISTA: RESUMEN (OVERVIEW) */}
        {view === 'overview' && (
            <div className="space-y-8">
                {/* Tarjetas Superiores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="Usuarios Totales" 
                        value="24,592" 
                        trend="+12% mes actual" 
                        icon="group" 
                        color="text-blue-600" 
                        bg="bg-blue-50"
                    />
                    <StatCard 
                        title="Volumen de Ventas" 
                        value="$1,204,500" 
                        trend="+$84k esta semana" 
                        icon="payments" 
                        color="text-primary" 
                        bg="bg-red-50"
                    />
                    <StatCard 
                        title="Tickets Abiertos" 
                        value="15" 
                        trend="3 urgentes" 
                        icon="warning" 
                        color="text-amber-500" 
                        bg="bg-amber-50"
                    />
                </div>

                {/* Gráficos o Tablas Recientes (Simulados) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Actividad Reciente</h3>
                        <div className="space-y-4">
                            {[1,2,3].map((i) => (
                                <div key={i} className="flex items-center gap-4 text-sm">
                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-gray-500">
                                        <span className="material-symbols-outlined text-xs">schedule</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-700">Nuevo vendedor registrado</p>
                                        <p className="text-xs text-gray-400">Hace {i * 10} minutos</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Estado del Sistema</h3>
                        <div className="space-y-4">
                            <SystemStatus label="Base de Datos (MySQL)" status="Operational" color="bg-green-500" />
                            <SystemStatus label="API Gateway" status="Operational" color="bg-green-500" />
                            <SystemStatus label="Servicio de Correos" status="Delayed" color="bg-amber-500" />
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* VISTAS EN CONSTRUCCIÓN */}
        {view !== 'overview' && (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">construction</span>
                <h3 className="text-xl font-bold text-gray-800">Módulo en Desarrollo</h3>
                <p className="text-gray-500">Estamos trabajando en la sección: <span className="font-mono text-primary">{view}</span></p>
            </div>
        )}

      </main>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function SidebarItem({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                active 
                ? "bg-primary text-white font-bold shadow-lg shadow-primary/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
        >
            <span className={`material-symbols-outlined text-xl ${active ? "" : "group-hover:scale-110 transition-transform"}`}>{icon}</span>
            <span className="text-sm">{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>}
        </button>
    )
}

function StatCard({ title, value, trend, icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`size-12 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${bg} ${color}`}>{trend}</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{title}</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{value}</h3>
        </div>
    )
}

function SystemStatus({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm font-bold text-gray-600">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${color}`}></span>
                <span className="text-xs font-bold text-gray-500">{status}</span>
            </div>
        </div>
    )
}