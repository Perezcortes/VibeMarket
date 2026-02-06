import Image from 'next/image';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductProps {
  product: {
    name: string;
    price: any;
    description: string | null;
    imageName: string | null;
    category: string;
  }
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Contenedor de Imagen */}
      <div className="relative h-64 w-full bg-[#F8F9FD] overflow-hidden">
        {product.imageName ? (
          <Image 
            src={`/images/${product.imageName}`} 
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
        )}
        {/* Badge de Categoría */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-widest shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Detalles del Producto */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#FF3366] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 min-h-[40px]">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase block">Precio</span>
            <span className="text-2xl font-black text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          
          <button className="bg-[#FF3366] text-white p-3 rounded-2xl hover:bg-[#E62E5C] transition-all shadow-lg shadow-pink-100 active:scale-95">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}