"use client"; // Crítico para manejar el estado del clic

import { useState } from "react";
import ProductCard from "./ProductCard";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: number | null;
  category: Category | null;
  stock: number;
  images: { url: string }[];
}

export default function ProductFilters({ products, categories }: { products: any[], categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Lógica de filtrado
  const filteredProducts = activeCategory 
    ? products.filter(p => p.category_id === activeCategory)
    : products;

  return (
    <div className="container mx-auto px-4">
      {/* --- BOTONES DE CATEGORÍAS --- */}
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeCategory === null 
            ? "bg-primary text-white shadow-lg" 
            : "bg-white text-gray-600 hover:bg-slate-100 border border-gray-200"
          }`}
        >
          Todos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeCategory === cat.id 
              ? "bg-primary text-white shadow-lg" 
              : "bg-white text-gray-600 hover:bg-slate-100 border border-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* --- GRID DE PRODUCTOS FILTRADOS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              image={product.images[0]?.url || "shopping_bag"} 
              title={product.name}
              price={Number(product.price)} 
              category={product.category?.name || "General"} 
              tag={product.stock < 5 ? "Últimas piezas" : undefined}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No hay productos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}