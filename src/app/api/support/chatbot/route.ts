import { NextResponse } from 'next/server';

const FAQ_DATABASE = [
  // --- SALUDOS Y BIENVENIDA ---
  {
    keywords: ['hola', 'buen', 'dias', 'tardes', 'noches', 'saludos', 'que tal'],
    answer: "¡Hola! Soy el asistente virtual de Vibe Market. Estoy aquí para ayudarte con tus compras, pedidos y dudas técnicas. ¿Qué tienes en mente?"
  },

  // --- PRODUCTOS Y CATÁLOGO (Basado en la imagen de la tienda) ---
  {
    keywords: ['producto', 'venden', 'catalogo', 'que hay', 'comprar', 'lista'],
    answer: "¡Claro! En Vibe Market tenemos estos productos disponibles ahora mismo:\n\n" +
            "☕ Cafetera Italiana Moka Pot - $850.00\n" +
            "🎮 PlayStation 5 Controller - $1,399.00\n" +
            "🪑 Silla Eames Replica - $1,250.00\n" +
            "🖱️ Mouse Gamer Logitech G502 - $1,200.00\n" +
            "⌨️ Teclado Mecánico RGB - $1,800.00\n" +
            "🕶️ Gafas de Sol Ray-Ban Aviator - $3,200.00\n" +
            "🎧 Sony WH-1000XM5 Noise Cancelling - $6,499.00\n" +
            "🌿 Planta Monstera Deliciosa - $600.00\n\n" +
            "¿Te interesa alguno en especial?"
  },

  // --- PROCESO DE COMPRA Y PEDIDOS ---
  {
    keywords: ['hacer un pedido', 'como comprar', 'realizar compra', 'proceso de pedido'],
    answer: "Comprar es fácil: 1. Navega por nuestros productos. 2. Añade tus favoritos al carrito. 3. Haz clic en el icono del carrito y selecciona 'Checkout'. 4. Ingresa tu dirección y método de pago. ¡Listo!"
  },
  {
    keywords: ['cancelar', 'anular pedido', 'cancelacion', 'me arrepenti'],
    answer: "Puedes cancelar un pedido desde 'Mis Pedidos' siempre que no haya sido enviado. Si ya fue despachado, deberás esperar a recibirlo y solicitar una devolución."
  },
  {
    keywords: ['estado', 'seguimiento', 'donde esta mi paquete', 'rastreo', 'rastrear'],
    answer: "Para saber dónde está tu pedido, ve a la sección 'Mis Pedidos' en tu perfil. Allí encontrarás el estado en tiempo real y el número de guía si ya fue enviado."
  },

  // --- ENVÍOS Y ENTREGA ---
  {
    keywords: ['costo de envio', 'precio envio', 'cuanto cuesta el envio', 'envio gratis'],
    answer: "Ofrecemos envío gratis en compras superiores a $999 pesos. Para pedidos menores, el costo estándar es de $99 pesos."
  },
  {
    keywords: ['tiempo', 'tarda', 'llegar', 'cuando llega', 'plazo'],
    answer: "Los envíos locales en la Mixteca tardan 24-48h. Para el resto de la república, el tiempo estimado es de 3 a 5 días hábiles mediante FedEx o DHL."
  },

  // --- STOCK Y DISPONIBILIDAD ---
  {
    keywords: ['stock', 'disponible', 'tienen mas', 'agotado', 'existencia'],
    answer: "Si puedes ver el producto y añadirlo al carrito, significa que tenemos stock disponible. Si un producto está agotado, puedes activar la campana de aviso para que te notifiquemos cuando regrese."
  },

  // --- DEVOLUCIONES Y CAMBIOS ---
  {
    keywords: ['devolucion', 'reembolso', 'devolver', 'cambio', 'garantia', 'fallo'],
    answer: "Tienes 30 días naturales para devolver cualquier producto. Debe estar en su empaque original y sin uso. El primer cambio de talla o devolución por falla es totalmente gratuito."
  },

  // --- PAGOS Y SEGURIDAD ---
  {
    keywords: ['pago', 'tarjeta', 'oxxo', 'transferencia', 'efectivo', 'paypal', 'metodos'],
    answer: "Aceptamos tarjetas de Crédito/Débito (Visa, Mastercard, AMEX), PayPal, transferencias SPEI y pagos en efectivo en cualquier OXXO."
  },

  // --- PROMOCIONES Y TALLAS ---
  {
    keywords: ['descuento', 'promocion', 'cupon', 'oferta', 'rebaja'],
    answer: "¡Siempre tenemos ofertas! Consulta nuestra sección de 'Ofertas de Temporada' en la página principal. Si tienes un cupón, aplícalo justo antes de pagar en el carrito."
  },
  {
    keywords: ['talla', 'guia de tallas', 'medidas', 'que talla soy'],
    answer: "En la descripción de cada producto encontrarás un enlace a la 'Guía de Tallas'. Te recomendamos medir una prenda similar que ya tengas para asegurar el ajuste perfecto."
  },

  // --- SOPORTE HUMANO ---
  {
    keywords: ['humano', 'agente', 'persona', 'ayuda', 'asesor', 'contacto', 'whatsapp', 'telefono'],
    answer: "Si necesitas hablar con una persona, nuestro equipo de soporte está disponible por WhatsApp al +52 (953) 123-4567 de lunes a viernes de 9am a 6pm."
  }
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Normalizamos el mensaje: minúsculas y sin acentos para que la búsqueda sea más robusta
    const query = message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Buscamos si alguna palabra clave del usuario coincide con nuestra base de datos
    const match = FAQ_DATABASE.find(item => 
      item.keywords.some(key => query.includes(key))
    );

    const reply = match 
      ? match.answer 
      : "Lo siento, no tengo una respuesta exacta para eso. ¿Podrías intentar con palabras clave como 'productos', 'envío', 'pagos' o 'devoluciones'?";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: "Error al procesar la solicitud." }, { status: 500 });
  }
}