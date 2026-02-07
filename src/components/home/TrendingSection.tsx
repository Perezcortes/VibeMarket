import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function TrendingSection() {
  
  // Obtener los primeros 8 productos de la DB
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { stock: 'desc' }, // Opcional: Ordenar
    include: {
      category: true,
      images: true
    }
  });

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Encabezado */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black mb-2 text-gray-900">Tendencias</h2>
            <p className="text-gray-500 font-medium">Lo más vendido de la semana.</p>
          </div>
          {/* ENLACE FUNCIONAL A VER TODO */}
          <Link href="/search" className="text-primary font-bold hover:underline flex items-center gap-1 group">
            Ver todo 
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
             const isLowStock = product.stock < 10;
             const isExpensive = Number(product.price) > 5000;

             return (
                <ProductCard 
                  key={product.id}
                  slug={product.slug} // Pasamos el slug para el enlace
                  image={product.images[0]?.url || "inventory_2"} 
                  title={product.name}
                  price={product.price.toString()} 
                  category={product.category?.name || "General"}
                  tag={isLowStock ? "¡Últimos!" : (isExpensive ? "Premium" : undefined)}
                  discount={isLowStock ? "-10%" : undefined}
                />
             )
          })}
        </div>
      </div>
    </section>
  );
}