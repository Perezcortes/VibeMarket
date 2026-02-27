import { prisma } from "@/lib/prisma";

/**
 * HU002: Visualización de detalle de producto
 * Criterio de aceptación: El comprador debe ver la descripción completa, 
 * todas las imágenes y el stock disponible de un producto específico.
 */
export const ProductDetailRepository = {

  /**
   * Obtiene la información detallada de un producto mediante su slug único.
   * Se utiliza el slug para mejorar el SEO y la legibilidad de la URL.
   */
  async execute(slug: string) {
    return prisma.product.findUnique({
      where: {
        slug: slug,
        is_active: true, // Seguridad: No mostrar productos desactivados por el vendedor
      },
      select: {
        id: true,
        name: true,
        description: true, // US002: Información extendida
        price: true,
        stock: true,       // Para que el comprador sepa si puede añadir al carrito
        updated_at: true,
        // Relación con todas las imágenes del producto
        images: {
          select: {
            id: true,
            url: true,
          }
        },
        // Información de la categoría para migas de pan (breadcrumbs)
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        // Información básica del vendedor para generar confianza
        seller: {
          select: {
            full_name: true,
            is_active: true,
          }
        },
        // Opcional: Podrías incluir el promedio de valoraciones
        reviews: {
          select: {
            rating: true,
            comment: true,
            created_at: true,
            user: {
              select: {
                full_name: true
              }
            }
          }
        }
      }
    });
  }

};