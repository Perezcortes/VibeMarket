"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  userId?: string;
  initialIsFavorite?: boolean;
}

export default function FavoriteButton({ productId, userId, initialIsFavorite = false }: Props) {
  // 1. El estado local controla la UI inmediatamente
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. Sincronizamos si las props cambian (importante para navegación entre productos)
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    // Optimistic Update: Cambiamos el color antes de que responda el servidor
    // para que el usuario sienta que la app es instantánea
    const previousState = isFavorite;
    setIsFavorite(!previousState);
    setLoading(true);

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        // Si la API falla, revertimos el color
        setIsFavorite(previousState);
      } else {
        // Si todo sale bien, forzamos a Next.js a actualizar los datos del servidor
        // en segundo plano (revalida los Server Components)
        router.refresh();
      }
    } catch (error) {
      setIsFavorite(previousState);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-6 border-2 rounded-xl transition-all duration-300 flex items-center justify-center h-full
        ${isFavorite 
          ? "bg-red-50 border-red-500 text-red-500" 
          : "bg-white border-gray-200 text-gray-400 hover:border-red-200"
        } 
        ${loading ? "opacity-70" : "active:scale-95"}`}
    >
      <span 
        className="material-symbols-outlined text-2xl"
        style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  );
}