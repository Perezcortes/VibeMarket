import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { handleApiError } from '@/lib/auth';

/**
 * GET /api/products/[id]
 * Obtiene el detalle de un producto específico del catálogo público
 * 
 * Params:
 * - id: string - ID o slug del producto
 * 
 * Esta ruta es pública y no requiere autenticación
 * Solo retorna productos activos
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Obtener producto del catálogo público
    // El servicio verifica que el producto esté activo
    const product = await productService.getPublicProductById(params.id);

    // 2. Retornar producto con toda su información
    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return handleApiError(error);
  }
}