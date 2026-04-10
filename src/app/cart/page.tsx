import { CartPersistenceService } from "@/services/seller/shoppingCart/SaveCart.service";
import { CartPersistenceRepository } from "@/repositories/seller//shopingCart/SaveCart.repository";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";

export default async function CartPage() {
  // Instanciamos el servicio (esto es lo que tus compañeros deben replicar)
  const cartService = new CartPersistenceService(CartPersistenceRepository);
  
  // ID temporal para pruebas (luego vendrá de NextAuth)
  const userId = "id-de-prueba-yamil"; 
  const cart = await cartService.getCartContent(userId);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300">shopping_cart</span>
        <h1 className="text-2xl font-bold mt-4">Tu carrito está vacío</h1>
        <p className="text-gray-500">¡Explora VibeMarket y encuentra algo increíble!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Mi Carrito ({cart.itemCount})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Columna de Productos */}
        <div className="lg:col-span-2 space-y-4">
          <CartList items={cart.items} />
        </div>

        {/* Columna de Resumen (Sticky) */}
        <div className="lg:col-span-1">
          <CartSummary total={cart.totalAmount} />
        </div>
      </div>
    </div>
  );
}