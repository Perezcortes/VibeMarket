// components/TrendingProducts.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

export default async function TrendingProducts() {
  // Consultamos la base de datos incluyendo imágenes y categoría
  const products = await prisma.product.findMany({
    where: {
      is_active: true,
      stock: { gt: 0 }
    },
    take: 4,
    include: {
      category: true,
      images: true, // Incluye la relación con las URLs de internet
    },
    orderBy: {
      id: 'desc' 
    }
  });

  if (products.length === 0) {
    return <p className="text-center py-10 text-gray-500">No hay productos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id}
          // Prioriza la URL de internet de tu tabla ProductImage
          image={product.images[0]?.url || "shopping_bag"} 
          title={product.name}
          price={Number(product.price)} 
          category={product.category?.name || "General"} 
          tag={product.stock < 5 ? "¡Últimas piezas!" : undefined}
        />
      ))}
    </div>
  );
}