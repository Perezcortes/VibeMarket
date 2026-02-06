'use client';

import { useState, useEffect, use } from 'react'; // Importamos 'use' para desenvolver params
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/products/Productform';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Confirmdialog';

// 1. Definimos la interfaz para Category
interface Category {
  id: number;
  name: string;
}

// 2. Interfaz Product corregida
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  is_active: boolean;
  category_id: number | null;
  images: {
    id: string;
    url: string;
  }[];
}

/**
 * Página: Editar Producto
 * Ruta: /seller/products/[id]
 */
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  const { id: productId } = use(params);
  
  // Estados
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar datos (Producto y Categorías en paralelo)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usamos productId que obtuvimos del hook use()
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/seller/products/${productId}`),
          fetch('/api/categories') 
        ]);

        if (!productRes.ok) {
          throw new Error('Producto no encontrado');
        }

        const productData = await productRes.json();
        setProduct(productData.data);

        if (categoriesRes.ok) {
           const catData = await categoriesRes.json();
           setCategories(catData.data || catData); 
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]); // La dependencia ahora es productId

  // Eliminar producto
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar el producto');
      }

      router.push('/seller/products');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-[#EE2B34] mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-bold text-lg text-red-800 dark:text-red-300 mb-2">
            Producto no encontrado
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'El producto que buscas no existe o no tienes permisos para verlo'}
          </p>
          <Link href="/seller/products">
            <Button variant="primary">Volver a productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/seller/products"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Editar Producto
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {product.name}
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            onClick={() => setShowDeleteDialog(true)}
            leftIcon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            }
          >
            Eliminar
          </Button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard
            label="Precio"
            value={`$${parseFloat(product.price).toLocaleString('es-MX')}`}
            icon="💰"
          />
          <InfoCard label="Stock" value={`${product.stock} unidades`} icon="📦" />
          <InfoCard
            label="Estado"
            value={product.is_active ? 'Activo' : 'Inactivo'}
            icon={product.is_active ? '✅' : '⏸️'}
          />
          <InfoCard label="Categoría" value="Sin categoría" icon="🏷️" />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <ProductForm
            mode="edit"
            productId={product.id}
            categories={categories} 
            initialData={{
              name: product.name,
              description: product.description || '',
              price: product.price,
              stock: product.stock.toString(),
              category_id: product.category_id?.toString() || '',
              is_active: product.is_active,
              images: product.images.map((img) => img.url), 
            }}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
      <p className="font-bold text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  );
}