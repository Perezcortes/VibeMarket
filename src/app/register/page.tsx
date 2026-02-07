"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/login"); // Redirigir al login si todo sale bien
    } else {
      const err = await res.json();
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Lado Izquierdo: Formulario */}
      <div className="flex items-center justify-center p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-primary mb-2">VibeMarket</h1>
            <h2 className="text-2xl font-bold text-text-main dark:text-white">Crea tu cuenta</h2>
            <p className="text-gray-500 mt-2">Únete a la mejor plataforma de comercio.</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nombre Completo</label>
              <input name="full_name" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ej. Juan Pérez" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
              <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="juan@ejemplo.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
              <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="••••••••" />
            </div>
            
            {/* Selector de Rol (Opcional, ocultar si solo quieres compradores por defecto) */}
            <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quiero ser</label>
               <select name="role" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none">
                  <option value="comprador">Comprador</option>
                  <option value="vendedor">Vendedor</option>
               </select>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-transform active:scale-95">
              Registrarme
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-secondary font-bold hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Lado Derecho: Imagen Decorativa (Responsive: Oculto en móvil) */}
      <div className="hidden md:flex bg-background-dark-warm relative overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
         <div className="relative z-10 text-center p-12">
            <h3 className="text-5xl font-black text-white mb-6">Tu estilo,<br/>tu mercado.</h3>
            <p className="text-white/80 text-xl">Descubre miles de productos únicos o crea tu propia tienda hoy mismo.</p>
         </div>
         {/* Círculos decorativos */}
         <div className="absolute top-10 right-10 size-64 bg-primary rounded-full blur-[100px] opacity-40"></div>
         <div className="absolute bottom-10 left-10 size-64 bg-secondary rounded-full blur-[100px] opacity-40"></div>
      </div>

    </div>
  );
}