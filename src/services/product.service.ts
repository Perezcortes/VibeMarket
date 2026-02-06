import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Tipo para la creación de un producto
 */
export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  images?: string[]; // Array de URLs de las imágenes subidas
}

/**
 * Tipo para la actualización de un producto
 */
export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  is_active?: boolean;
  images?: string[]; // Array de URLs finales (las que deben quedar)
}

/**
 * ProductService - Encapsula toda la lógica de negocio relacionada con productos
 */
export class ProductService {
  /**
   * Crea un nuevo producto para un vendedor
   * @param sellerId - ID del vendedor que crea el producto
   * @param data - Datos del producto a crear
   * @returns El producto creado con sus imágenes
   */
  async createProduct(sellerId: string, data: CreateProductInput) {
    // Validaciones de negocio
    if (data.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (data.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Generar slug único a partir del nombre
    const slug = await this.generateUniqueSlug(data.name);

    // Crear el producto y sus relaciones (imágenes) en una sola operación
    return await prisma.product.create({
      data: {
        seller_id: sellerId,
        name: data.name,
        slug,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        stock: data.stock,
        category_id: data.category_id,
        is_active: true, // Por defecto activo
        // Lógica para crear las imágenes en la tabla relacionada
        images: {
          create: data.images?.map((url) => ({
            url: url,
          })),
        },
      },
      include: {
        category: true,
        images: true, // Retornamos las imágenes creadas
        seller: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Obtiene todos los productos de un vendedor específico
   * @param sellerId - ID del vendedor
   * @param includeInactive - Si debe incluir productos inactivos (default: true)
   * @returns Lista de productos del vendedor
   */
  async getSellerProducts(sellerId: string, includeInactive: boolean = true) {
    const where: Prisma.ProductWhereInput = {
      seller_id: sellerId,
    };

    // Si no se incluyen inactivos, filtrar solo activos
    if (!includeInactive) {
      where.is_active = true;
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obtiene un producto específico verificando que pertenezca al vendedor
   * @param productId - ID del producto
   * @param sellerId - ID del vendedor (para verificar propiedad)
   * @returns El producto si existe y pertenece al vendedor
   */
  async getSellerProductById(productId: string, sellerId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        seller_id: sellerId, // Verificación de propiedad
      },
      include: {
        category: true,
        images: true,
        reviews: {
          take: 10,
          orderBy: { created_at: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Producto no encontrado o no tienes permisos para acceder a él');
    }

    return product;
  }

  /**
   * Actualiza un producto del vendedor con sincronización de imágenes
   * @param productId - ID del producto a actualizar
   * @param sellerId - ID del vendedor (para verificar propiedad)
   * @param data - Datos a actualizar
   * @returns El producto actualizado
   */
  async updateProduct(
    productId: string,
    sellerId: string,
    data: UpdateProductInput
  ) {
    // 1. Verificar que el producto existe y pertenece al vendedor
    const currentProduct = await this.getSellerProductById(productId, sellerId);

    // 2. Validaciones de negocio básicas
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // 3. Si se actualiza el nombre, generar nuevo slug
    let slug: string | undefined;
    if (data.name && data.name !== currentProduct.name) {
      slug = await this.generateUniqueSlug(data.name, productId);
    }

    // 4. Ejecutar actualización en una transacción para asegurar integridad (Imágenes + Datos)
    return await prisma.$transaction(async (tx) => {
      
      // A) Manejo de Imágenes: Si se envía un array de imágenes, sincronizamos
      if (data.images) {
        // 1. Eliminar imágenes que ya no están en la lista enviada
        await tx.productImage.deleteMany({
          where: {
            product_id: productId,
            url: { notIn: data.images },
          },
        });

        // 2. Encontrar cuáles de las imágenes enviadas ya existen en la DB
        const existingImages = await tx.productImage.findMany({
          where: {
            product_id: productId,
            url: { in: data.images },
          },
          select: { url: true },
        });

        const existingUrls = new Set(existingImages.map((img) => img.url));

        // 3. Filtrar las que son realmente nuevas
        const newImagesToCreate = data.images.filter((url) => !existingUrls.has(url));

        // 4. Crear solo las nuevas imágenes
        if (newImagesToCreate.length > 0) {
          await tx.productImage.createMany({
            data: newImagesToCreate.map((url) => ({
              product_id: productId,
              url: url,
            })),
          });
        }
      }

      // B) Preparar datos para actualización del producto
      const updateData: Prisma.ProductUpdateInput = {
        ...(data.name && { name: data.name, slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: new Prisma.Decimal(data.price) }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.category_id !== undefined && { category_id: data.category_id }),
        ...(data.is_active !== undefined && { is_active: data.is_active }),
      };

      // C) Actualizar el producto
      return await tx.product.update({
        where: { id: productId },
        data: updateData,
        include: {
          category: true,
          images: true, // Devolver imágenes actualizadas
          seller: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      });
    });
  }

  /**
   * Activa o desactiva un producto
   * @param productId - ID del producto
   * @param sellerId - ID del vendedor (para verificar propiedad)
   * @param isActive - Nuevo estado del producto
   * @returns El producto actualizado
   */
  async toggleProductStatus(
    productId: string,
    sellerId: string,
    isActive: boolean
  ) {
    // Verificar propiedad
    await this.getSellerProductById(productId, sellerId);

    return await prisma.product.update({
      where: { id: productId },
      data: { is_active: isActive },
      include: {
        category: true,
      },
    });
  }

  /**
   * Elimina un producto (soft delete - solo lo desactiva)
   * En un marketplace, generalmente no se eliminan productos que tienen historial de ventas
   * @param productId - ID del producto
   * @param sellerId - ID del vendedor (para verificar propiedad)
   */
  async deleteProduct(productId: string, sellerId: string) {
    // Verificar propiedad
    const product = await this.getSellerProductById(productId, sellerId);

    // Verificar si tiene órdenes asociadas
    const ordersCount = await prisma.orderItem.count({
      where: { product_id: productId },
    });

    if (ordersCount > 0) {
      // Si tiene ventas, solo desactivar
      return await this.toggleProductStatus(productId, sellerId, false);
    }

    // Si no tiene ventas, se puede eliminar físicamente
    return await prisma.product.delete({
      where: { id: productId },
    });
  }

  /**
   * Obtiene productos activos del catálogo público
   * @param filters - Filtros opcionales (categoría, vendedor, búsqueda)
   * @returns Lista de productos activos
   */
  async getPublicProducts(filters?: {
    categoryId?: number;
    sellerId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const where: Prisma.ProductWhereInput = {
      is_active: true, // Solo productos activos en el catálogo público
      stock: { gt: 0 }, // Solo productos con stock disponible
    };

    // Aplicar filtros
    if (filters?.categoryId) {
      where.category_id = filters.categoryId;
    }

    if (filters?.sellerId) {
      where.seller_id = filters.sellerId;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            full_name: true,
          },
        },
        images: {
          take: 1, // Solo primera imagen para el listado
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obtiene un producto específico del catálogo público
   * @param productId - ID o slug del producto
   * @returns El producto si está activo
   */
  async getPublicProductById(productId: string) {
    // Buscar por ID o slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: productId }, { slug: productId }],
        is_active: true, // Solo productos activos
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }

  /**
   * Genera un slug único a partir del nombre del producto
   * @param name - Nombre del producto
   * @param excludeId - ID a excluir en la búsqueda (para actualizaciones)
   * @returns Slug único
   */
  private async generateUniqueSlug(
    name: string,
    excludeId?: string
  ): Promise<string> {
    // Convertir a slug: minúsculas, sin espacios, sin caracteres especiales
    let baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .trim()
      .replace(/\s+/g, '-'); // Espacios a guiones

    let slug = baseSlug;
    let counter = 1;

    // Verificar si el slug ya existe
    while (true) {
      const where: Prisma.ProductWhereInput = { slug };
      
      // Si es una actualización, excluir el producto actual
      if (excludeId) {
        where.id = { not: excludeId };
      }

      const existing = await prisma.product.findFirst({ where });

      if (!existing) {
        break; // Slug disponible
      }

      // Si existe, agregar contador
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

// Exportar instancia única del servicio (Singleton)
export const productService = new ProductService();