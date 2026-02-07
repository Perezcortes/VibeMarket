"use client"; // 👈 Esto es vital para que funcionen los clics
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function NavbarUser({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Si NO hay usuario, mostramos los botones de ingreso
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">
          Ingresar
        </Link>
        <Link href="/register" className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/30 transition-transform active:scale-95">
          Crear cuenta
        </Link>
      </div>
    );
  }

  // Si SÍ hay usuario, mostramos Avatar + Menú Dropdown
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity"
      >
        <div className="text-right hidden md:block">
          <p className="text-xs text-gray-500 font-bold">Hola,</p>
          <p className="text-sm font-bold truncate max-w-[100px]">{user.name?.split(' ')[0]}</p>
        </div>
        <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 cursor-pointer">
          {user.name?.charAt(0) || "U"}
        </div>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <>
            {/* Fondo invisible para cerrar al hacer clic fuera */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            
            <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                    <p className="text-xs text-gray-400 font-bold uppercase">Mi Cuenta</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                </div>
                
                {/* Opción Dashboard (Solo si no es comprador, o para todos si quieres) */}
                {user.role !== 'comprador' && (
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-gray-400">dashboard</span>
                        Panel de Control
                    </Link>
                )}

                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-gray-400">person</span>
                    Mi Perfil
                </Link>

                <div className="h-px bg-gray-100 my-1"></div>

                <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar Sesión
                </button>
            </div>
        </>
      )}
    </div>
  );
}