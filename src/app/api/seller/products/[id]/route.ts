import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import {
  getAuthenticatedUser,
  requireSellerRole,
  handleApiError,
} from '@/lib/auth';

/**
 * GET /api/seller/products/[id]
 * Obtiene un producto específico del vendedor autenticado
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Corregido a Promise
) {
  try {
    const { id } = await params; // Desenvolver params
    const user = await getAuthenticatedUser(request);
    requireSellerRole(user);

    const product = await productService.getSellerProductById(
      id,
      user.id
    );

    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/seller/products/[id]
 * Actualiza un producto del vendedor autenticado
 */
/**
 * PUT /api/seller/products/[id]
 * Actualiza un producto recibiendo FormData (archivos + textos)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    requireSellerRole(user);

    // 1. IMPORTANTE: Usamos formData() en lugar de json()
    const formData = await request.formData();

    // 2. Extraemos los valores simples (llegan como strings o null)
    const name = formData.get('name')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const priceStr = formData.get('price')?.toString();
    const stockStr = formData.get('stock')?.toString();
    const categoryIdStr = formData.get('category_id')?.toString();
    const isActiveStr = formData.get('is_active')?.toString();

    // 3. Extraemos las colecciones (Arrays)
    // 'existing_images': URLs que el usuario decidió mantener
    const existingImages = formData.getAll('existing_images') as string[];
    // 'files': Nuevas imágenes binarias (File objects) que se deben subir
    const newFiles = formData.getAll('files') as File[];

    // --- VALIDACIONES MANUALES (Porque todo llega como string) ---

    if (name !== undefined) {
      if (name.length < 3) return Response.json({ error: 'El nombre debe tener al menos 3 caracteres' }, { status: 400 });
      if (name.length > 150) return Response.json({ error: 'El nombre no puede exceder 150 caracteres' }, { status: 400 });
    }

    let price: number | undefined;
    if (priceStr) {
      price = parseFloat(priceStr);
      if (isNaN(price) || price <= 0) return Response.json({ error: 'El precio debe ser un número mayor a 0' }, { status: 400 });
    }

    let stock: number | undefined;
    if (stockStr) {
      stock = parseInt(stockStr);
      if (isNaN(stock) || stock < 0) return Response.json({ error: 'El stock debe ser un número válido' }, { status: 400 });
    }

    let category_id: number | undefined;
    if (categoryIdStr) {
      category_id = parseInt(categoryIdStr);
      if (isNaN(category_id)) return Response.json({ error: 'Categoría inválida' }, { status: 400 });
    }

    // --- PREPARAR DATOS PARA EL SERVICIO ---
    
    const product = await productService.updateProduct(
      id,
      user.id,
      {
        name,
        description,
        price,
        stock,
        category_id, // Prisma espera Int
        is_active: isActiveStr === 'true', // Convertir string "true" a boolean
        images: existingImages, // URLs a conservar
      }
    );

    return Response.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    });

  } catch (error) {
    return handleApiError(error);
  }
}
/**
 * PATCH /api/seller/products/[id]
 * Activa o desactiva un producto
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Corregido a Promise
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    requireSellerRole(user);

    const body = await request.json();

    if (typeof body.is_active !== 'boolean') {
      return Response.json(
        { error: 'El campo is_active es requerido y debe ser booleano' },
        { status: 400 }
      );
    }

    const product = await productService.toggleProductStatus(
      id,
      user.id,
      body.is_active
    );

    return Response.json({
      success: true,
      message: `Producto ${body.is_active ? 'activado' : 'desactivado'} exitosamente`,
      data: product,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/seller/products/[id]
 * Elimina un producto (o soft delete si tiene ventas)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Corregido a Promise
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    requireSellerRole(user);

    const result = await productService.deleteProduct(id, user.id);

    const isSoftDelete = result.is_active === false;

    return Response.json({
      success: true,
      message: isSoftDelete
        ? 'Producto desactivado (tiene ventas registradas)'
        : 'Producto eliminado permanentemente',
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}