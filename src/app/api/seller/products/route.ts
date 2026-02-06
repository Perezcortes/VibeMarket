import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product.service';
import {
  getAuthenticatedUser,
  requireSellerRole,
  handleApiError,
} from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * Función para guardar archivo en carpeta LOCAL (public/uploads)
 */
async function uploadToLocalFolder(file: File): Promise<string> {
  // 1. Convertir archivo a Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. Generar nombre único para no sobreescribir
  // Ejemplo: "image-123456789.png"
  const fileName = `img-${Date.now()}-${file.name.replaceAll(' ', '_')}`;
  
  // 3. Ruta absoluta donde se guardará (dentro de public/uploads)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, fileName);

  // 4. Escribir el archivo en el disco duro
  await writeFile(filePath, buffer);

  // 5. Devolver la URL pública (la que usará el navegador)
  return `/uploads/${fileName}`;
}

export async function GET(request: NextRequest) {
  // ... (Esta parte queda IGUAL que antes)
  try {
    const user = await getAuthenticatedUser(request);
    requireSellerRole(user);
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const products = await productService.getSellerProducts(user.id, includeInactive);
    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    requireSellerRole(user);

    const formData = await request.formData();

    // Extraer datos (IGUAL que antes)
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const stockStr = formData.get('stock') as string;
    const categoryIdStr = formData.get('category_id') as string;
    const isActiveStr = formData.get('is_active') as string;

    const price = parseFloat(priceStr);
    const stock = parseInt(stockStr);
    const category_id = parseInt(categoryIdStr);
    const is_active = isActiveStr === 'true';

    // Validaciones (IGUAL que antes)
    if (!name || isNaN(price) || isNaN(stock) || !category_id) {
       return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // --- PROCESAMIENTO DE IMÁGENES (LOCAL) ---
    
    // A) URLs existentes
    const existingImages = formData.getAll('existing_images') as string[];
    
    // B) Archivos nuevos
    const newFiles = formData.getAll('files') as File[];

    // C) Guardar archivos en tu PC (public/uploads)
    let uploadedUrls: string[] = [];
    if (newFiles.length > 0) {
      uploadedUrls = await Promise.all(
        newFiles.map((file) => uploadToLocalFolder(file))
      );
    }

    // D) Combinar
    const allImages = [...existingImages, ...uploadedUrls];

    // Guardar en BD
    const product = await productService.createProduct(user.id, {
      name: name.trim(),
      description: description?.trim() || '',
      price,
      stock,
      category_id,
      images: allImages,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Producto creado exitosamente',
        data: product,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error guardando producto:', error);
    return handleApiError(error);
  }
}