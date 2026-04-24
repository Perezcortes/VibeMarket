/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Presentación (UI) - COMPRADORES
 * Historia de Usuario: US009-C - Visualización de ofertas/descuentos
 * AUTOR (Responsable): Amaury Yamil Morales Diaz
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 14/04/2026
 */

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  slug: string;
  image: string;
  title: string;
  price: number | string;
  category: string;
  tag?: string;
  discount?: string | number; // Modificado para aceptar porcentaje (US009-C)
  productId: string;
  userId?: string;
  isFavorite?: boolean;
  rating?: number;
}

export default function ProductCard({ 
  slug, image, title, price, category, tag, discount, productId, userId, 
  isFavorite = false, 
  rating = 0 
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [favorited, setFavorited] = useState(isFavorite);
  const router = useRouter();
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Lógica US009-C: Cálculo de descuentos
  const discountPercentage = typeof discount === 'number' ? discount : parseInt(discount as string) || 0;
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount ? numericPrice - (numericPrice * (discountPercentage / 100)) : numericPrice;

  // US09-D: Función para Favoritos
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Inicia sesión para guardar favoritos");
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      
      if (response.ok) {
        setFavorited(!favorited);
        router.refresh();
      }
    } catch (error) {
      console.error("Error en favoritos");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); 
    if (!userId) { router.push("/login"); return; }
    setIsAdding(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1, userId }),
      });
      if (response.ok) { alert("¡Producto añadido!"); router.refresh(); }
    } finally { setIsAdding(false); }
  };

  return (
    <Link href={`/products/${slug}`} className="block h-full">
      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-gray-100 relative flex flex-col h-full">
        
        {/* US09-D: Botón de Favoritos (Corazón) */}
        <button 
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 z-20 size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <span className={`material-symbols-outlined text-xl ${favorited ? 'fill-1 text-red-500' : 'text-gray-400'}`}>
            favorite
          </span>
        </button>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {tag && <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-md">{tag}</span>}
          {/* US009-C: Etiqueta de Oferta */}
          {hasDiscount && <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-md tracking-wider">-{discountPercentage}% OFERTA</span>}
        </div>
        
        <div className="aspect-square bg-white rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`absolute bottom-4 right-4 size-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 
              ${isAdding ? 'bg-gray-400' : 'bg-white text-black opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:bg-primary hover:text-white'}`}
          >
             <span className="material-symbols-outlined text-xl">{isAdding ? 'sync' : 'add_shopping_cart'}</span>
          </button>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{category}</p>
            
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-amber-400 text-sm fill-1">star</span>
              <span className="text-xs font-bold text-gray-600">{rating > 0 ? rating.toFixed(1) : "N/A"}</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-2 truncate text-base">{title}</h3>
          
          {/* US009-C: Precio original tachado junto al precio con descuento */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-primary">
                ${Number(discountedPrice).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            {hasDiscount && (
              <span className="text-sm font-medium text-gray-400 line-through">
                ${Number(numericPrice).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}