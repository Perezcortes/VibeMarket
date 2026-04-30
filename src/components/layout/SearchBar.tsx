"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Inicializamos con el valor actual de la URL si existe
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // US010-A: Empujamos el parámetro 'q' a la URL
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search"); // Si busca vacío, va al catálogo completo
    }
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos, marcas y más..." 
        className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-sm font-medium text-slate-800"
      />
      <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
        <span className="material-symbols-outlined text-gray-400 hover:text-primary transition-colors">search</span>
      </button>
    </form>
  );
}