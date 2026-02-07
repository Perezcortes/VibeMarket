import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/ui/ProductCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 1. Definimos el tipo como una Promesa
type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  
  // 2. DESEMPAQUETAMOS LOS PARÁMETROS CON AWAIT
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  // Busca TODOS los productos (o filtra si hay búsqueda)
  const products = await prisma.product.findMany({
    where: {
      name: { contains: query },
      is_active: true
    },
    include: { images: true, category: true }
  });

  return (
    <div className="min-h-screen bg-slate-50 text-text-main font-sans">
      <Navbar user={session?.user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-black mb-2">Catálogo Completo</h1>
            <p className="text-gray-500">Mostrando {products.length} resultados disponibles</p>
        </div>

        {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                <p className="text-xl font-bold text-gray-600">No encontramos productos.</p>
                <p className="text-gray-400">Intenta buscar otra cosa.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard 
                    key={product.id}
                    slug={product.slug} 
                    image={product.images[0]?.url || "inventory_2"} 
                    title={product.name}
                    price={product.price.toString()} 
                    category={product.category?.name || "General"}
                    tag={product.stock < 10 ? "¡Poco Stock!" : undefined}
                    />
                ))}
            </div>
        )}
      </main>
    </div>
  );
}