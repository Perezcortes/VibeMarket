"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Evita recarga de página automática
    });

    if (res?.error) {
      setError("Credenciales inválidas. Inténtalo de nuevo.");
    } else {
      router.push("/dashboard"); // O a la home '/'
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Lado Izquierdo: Imagen Decorativa (Invertido para variedad visual) */}
      <div className="hidden md:flex bg-background-dark relative overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 to-primary/20"></div>
         <div className="relative z-10 text-center p-12">
            <span className="material-symbols-outlined text-8xl text-accent mb-4">storefront</span>
            <h3 className="text-4xl font-black text-white mb-4">Bienvenido de nuevo</h3>
            <p className="text-white/80 text-lg">Gestiona tus pedidos, revisa tu catálogo y sigue creciendo.</p>
         </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex items-center justify-center p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
             <h1 className="text-3xl font-black text-primary mb-2">VibeMarket</h1>
             <h2 className="text-xl font-bold text-gray-500">Ingresa a tu cuenta</h2>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm font-bold text-center border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
              <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" placeholder="tucorreo@vibemarket.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
              <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" />
            </div>

            <div className="flex justify-end">
                <a href="#" className="text-xs font-bold text-secondary hover:underline">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="w-full bg-secondary hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/30 transition-transform active:scale-95">
              Iniciar Sesión
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}