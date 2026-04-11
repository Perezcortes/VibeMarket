import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/lib/authOptions"; 

export default async function TrendingSection() {
  // 1. Obtener la sesión del servidor para Favoritos (US09-D)
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // 2. Obtener productos incluyendo Reseñas y Favoritos del usuario actual
  const products = await prisma.product.findMany({
    take: 8,
    where: { is_active: true },
    orderBy: { stock: 'desc' },
    include: {
      category: true,
      images: true,
      reviews: true, // Para US09-E (Calificaciones)
      favorites: {   // Para US09-D (Favoritos)
        where: {
          user_id: userId || "" 
        }
      }
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

             // US09-E: Calcular el promedio de calificación
             const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
             const averageRating = product.reviews.length > 0 
                ? totalRating / product.reviews.length 
                : 0;

             // US09-D: Verificar si el producto ya es favorito del usuario
             const isFavorite = product.favorites.length > 0;

             return (
                <ProductCard 
                 key={product.id}
                 productId={product.id}
                 userId={userId}
                 slug={product.slug}
                 image={product.images[0]?.url || "inventory_2"}
                 title={product.name}
                 price={product.price.toString()}
                 category={product.category?.name || "General"}
                 
                 // --- NUEVAS PROPS PARA LAS HISTORIAS US09 ---
                 rating={averageRating}  // US09-E
                 isFavorite={isFavorite} // US09-D
                 // -------------------------------------------

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