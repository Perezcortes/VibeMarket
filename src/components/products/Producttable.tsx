'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/Confirmdialog';

// --- CAMBIO 1: Actualizar la interfaz para recibir imágenes ---
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
  };
  images: {
    id: string;
    url: string;
  }[];
}

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

/**
 * ProductTable - Tabla de productos con acciones de editar y eliminar
 */
export function ProductTable({ products, onDelete, onRefresh }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const productToDelete = products.find((p) => p.id === deleteId);

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No hay productos
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comienza creando tu primer producto.
        </p>
        <div className="mt-6">
          <Link href="/seller/products/create">
            <Button variant="primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Producto
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      
                      {/* --- CAMBIO 2: Mostrar Miniatura --- */}
                      <div className="flex-shrink-0 h-10 w-10 mr-4">
                        {product.images && product.images.length > 0 ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                            src={product.images[0].url}
                            alt={product.name}
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* ----------------------------------- */}

                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Sin categoría
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${parseFloat(product.price).toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {product.stock} unidades
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                        product.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={`/seller/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}