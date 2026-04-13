/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Presentación (UI) - ADMINISTRACIÓN Y SEGURIDAD
 * Historia de Usuario: US008-B - Recuperación de contraseña por email
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 24/03/2026
 */

"use client"; 

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Llamamos a la API que acabas de crear
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      // Ya sea éxito o error de seguridad, mostramos el mensaje al usuario
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage("Ocurrió un error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Recuperar Contraseña
        </h2>
        <p className="text-sm text-center text-gray-600">
          Ingresa tu correo electrónico y te enviaremos las instrucciones.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@correo.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        {message && (
          <div className="p-3 mt-4 text-sm text-center text-blue-800 bg-blue-100 rounded-md">
            {message}
          </div>
        )}

        <div className="text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}