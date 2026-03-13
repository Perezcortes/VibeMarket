/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Checkout y Gestión de Inventario
 * Historia de Usuario: HU017 - Bloqueo de compra por falta de stock
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { StockGuardRepository } from "@/repositories/seller/shopingCart/BlockOrder.repository"; // Repositorio especializado para la lógica de bloqueo de stock durante el checkout
import { CartPersistenceRepository } from "@/repositories/seller/shopingCart/SaveCart.repository"; // Reutilizamos el repo de persistencia para obtener el carrito actual del usuario

// ─── DTO de entrada ────────────────────────────────────────────────────────
export interface CheckoutRequestDTO {
  userId: string;
  addressId: string;
}

// ─── DTO de salida ─────────────────────────────────────────────────────────
export interface CheckoutResponseDTO {
  success: boolean;
  orderId?: string;
  message: string;
  errorDetails?: string[];
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class CheckoutService {
  constructor(
    private readonly repository: typeof StockGuardRepository,
    private readonly cartRepository: typeof CartPersistenceRepository
  ) {}

  /**
   * HU017 — Procesa la orden asegurando que hay stock para cada artículo.
   * * @param data - IDs de usuario y dirección de envío
   */
  async processPurchase(data: CheckoutRequestDTO): Promise<CheckoutResponseDTO> {
    
    // 1. Recuperar el carrito actual del usuario
    const cart = await this.cartRepository.getSavedCart(data.userId);

    if (!cart || cart.items.length === 0) {
      throw new Error("No puedes procesar una compra con el carrito vacío.");
    }

    // 2. Preparar los items para la transacción y validación preliminar
    const checkoutItems = cart.items.map(item => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: Number(item.product.price)
    }));

    // 3. Ejecutar la transacción segura
    try {
      const result = await this.repository.secureCheckout({
        userId: data.userId,
        addressId: data.addressId,
        cartItems: checkoutItems
      });

      return {
        success: true,
        orderId: (result as any)?.id, // Suponiendo que el repo retorna la orden creada
        message: "¡Compra realizada con éxito! El stock ha sido reservado."
      };

    } catch (error: any) {
      // 4. Manejo de errores de Stock (HU017)
      console.error("Fallo en el checkout:", error.message);
      
      return {
        success: false,
        message: "La compra no pudo completarse debido a falta de disponibilidad.",
        errorDetails: [error.message]
      };
    }
  }
}