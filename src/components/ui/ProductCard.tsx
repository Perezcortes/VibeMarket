"use client";
import Link from "next/link";

interface ProductCardProps {
  slug: string; // ID único para la URL
  image: string;
  title: string;
  price: number | string;
  category: string;
  tag?: string;
  discount?: string;
}

export default function ProductCard({ slug, image, title, price, category, tag, discount }: ProductCardProps) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return (
    <Link href={`/products/${slug}`} className="block h-full">
      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-gray-100 relative cursor-pointer flex flex-col h-full">
        
        {/* Etiquetas Superiores */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {tag && <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-md">{tag}</span>}
          {discount && <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">{discount}</span>}
        </div>
        
        {/* Imagen del Producto */}
        <div className="aspect-square bg-white rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
          {/* Si empieza con http es una URL real, si no, es un icono material */}
          {image.startsWith('http') ? (
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
          ) : (
              <span className="material-symbols-outlined text-6xl text-gray-300">{image}</span>
          )}
          
          {/* Botón Flotante (UI Candy) */}
          <button className="absolute bottom-4 right-4 bg-white text-black size-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white">
             <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>

        {/* Información */}
        <div className="mt-auto">
          <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">{category}</p>
          <h3 className="font-bold text-gray-800 mb-2 truncate text-base">{title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-primary">
                ${Number(numericPrice).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            <div className="flex text-accent text-sm gap-0.5 select-none">
               {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-base text-yellow-400 filled">star</span>)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}