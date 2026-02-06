import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { handleApiError } from '@/lib/auth';

/**
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Obtener parámetros de búsqueda
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      categoryId: searchParams.get('categoryId')
        ? parseInt(searchParams.get('categoryId')!)
        : undefined,
      sellerId: searchParams.get('sellerId') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice')
        ? parseFloat(searchParams.get('minPrice')!)
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? parseFloat(searchParams.get('maxPrice')!)
        : undefined,
    };

    // 2. Validar filtros numéricos
    if (filters.minPrice !== undefined && (isNaN(filters.minPrice) || filters.minPrice < 0)) {
      return Response.json(
        { error: 'El precio mínimo debe ser un número válido mayor o igual a 0' },
        { status: 400 }
      );
    }

    if (filters.maxPrice !== undefined && (isNaN(filters.maxPrice) || filters.maxPrice < 0)) {
      return Response.json(
        { error: 'El precio máximo debe ser un número válido mayor o igual a 0' },
        { status: 400 }
      );
    }

    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      return Response.json(
        { error: 'El precio mínimo no puede ser mayor al precio máximo' },
        { status: 400 }
      );
    }

    // 3. Obtener productos del catálogo público
    const products = await productService.getPublicProducts(filters);

    // 4. Retornar productos
    return Response.json({
      success: true,
      data: products,
      count: products.length,
      filters: filters,
    });
  } catch (error) {
    return handleApiError(error);
  }
}