import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { Filter } from 'lucide-react';

export default async function CatalogPage() {
  // Adaptamos la consulta a la nueva estructura
  const products = await prisma.products.findMany({
    where: { 
      is_active: true // Campo actualizado de isActive a is_active
    },
    include: {
      product_images: true, // Incluimos la tabla relacionada de imágenes
      categories: true      // Opcional: Incluimos la categoría para mostrarla en la card
    },
    // Nota: El respaldo actual no incluye 'created_at' en la tabla products, 
    // por lo que ordenamos por 'name' o eliminamos el orderBy
    orderBy: { name: 'asc' } 
  });

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      {/* Header con Buscador */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-1">
                Catálogo <span className="text-[#FF3366]">VibeMarket</span>
              </h1>
              <p className="text-gray-500">Los mejores productos en un solo lugar.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Barra de estado / Filtros rápidos */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-gray-600 uppercase tracking-tight">
              {products.length} Productos disponibles
            </span>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-gray-700">
            <Filter size={16} />
            Filtrar por Categoría
          </button>
        </div>

        {/* Grid de Productos */}
        {products.length === 0 ? (
          <div className="bg-white rounded-[40px] p-24 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-medium">No encontramos lo que buscas por ahora.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}