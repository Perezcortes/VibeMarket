import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

// Actualizamos la interfaz para que coincida con los campos de tu base de datos real
interface ProductProps {
  product: {
    id: string; //
    name: string; //
    price: any; // Se maneja como Decimal en Prisma
    description: string | null; //
    // Relación con product_images: es un arreglo
    product_images: {
      url: string;
    }[];
    // Relación con categories
    categories?: {
      name: string;
    } | null;
  }
}

export default function ProductCard({ product }: ProductProps) {
  // Obtenemos la URL de la primera imagen disponible o un placeholder
  const imageUrl = product.product_images && product.product_images.length > 0 
    ? product.product_images[0].url 
    : '/images/placeholder.png';

  // Obtenemos el nombre de la categoría desde la relación
  const categoryName = product.categories?.name || 'General';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Contenedor de Imagen */}
      <div className="relative h-64 w-full bg-[#F8F9FD] overflow-hidden">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
        )}
        {/* Badge de Categoría */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-widest shadow-sm">
          {categoryName}
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