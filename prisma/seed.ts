import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando sembrado de datos VibeMarket...')

  // 1. USUARIOS
  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: { email: 'cliente@test.com', full_name: 'Jose Alberto', password_hash: '$2a$10$dummy', role: 'comprador' }
  })

  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@vibemarket.com' },
    update: {},
    create: { email: 'vendedor@vibemarket.com', full_name: 'TechStore Oficial', password_hash: '$2a$10$dummy', role: 'vendedor', is_active: true }
  })

  // 2. CATEGORÍAS
  const catTecno = await prisma.category.upsert({ where: { slug: 'tecnologia' }, update: {}, create: { name: 'Tecnología', slug: 'tecnologia', description: 'Gadgets' } })
  const catModa = await prisma.category.upsert({ where: { slug: 'moda' }, update: {}, create: { name: 'Moda', slug: 'moda', description: 'Estilo' } })
  const catHogar = await prisma.category.upsert({ where: { slug: 'hogar' }, update: {}, create: { name: 'Hogar', slug: 'hogar', description: 'Decoración' } })
  const catGaming = await prisma.category.upsert({ where: { slug: 'gaming' }, update: {}, create: { name: 'Gaming', slug: 'gaming', description: 'Videojuegos' } })

  // 3. PRODUCTOS EXTENDIDOS
  const productos = [
    // --- TECNOLOGÍA ---
    {
      name: "Sony WH-1000XM5 Noise Cancelling",
      description: "Los mejores audífonos del mercado con cancelación de ruido líder, sonido premium y 30 horas de batería.",
      price: 6499.00, stock: 45, category_id: catTecno.id,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Apple MacBook Air M2",
      description: "Chip M2 de próxima generación. Sorprendentemente delgada y con una eficiencia excepcional.",
      price: 24999.00, stock: 12, category_id: catTecno.id,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Cámara Sony Alpha a7 III",
      description: "Sensor Full Frame, grabación 4K y enfoque automático de precisión profesional.",
      price: 42500.00, stock: 5, category_id: catTecno.id,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Monitor Curvo Samsung 34",
      description: "Sumérgete en el juego con una pantalla ultra ancha y tasa de refresco de 144Hz.",
      price: 9500.00, stock: 20, category_id: catTecno.id,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    },
    
    // --- MODA ---
    {
      name: "Nike Air Jordan 1 Retro",
      description: "Un clásico que no pasa de moda. Diseño icónico y comodidad superior.",
      price: 3899.00, stock: 8, category_id: catModa.id,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Mochila Herschel Little America",
      description: "Mochila clásica de montañismo con funcionalidad moderna y funda para laptop.",
      price: 2100.00, stock: 25, category_id: catModa.id,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Gafas de Sol Ray-Ban Aviator",
      description: "Protección UV total con el estilo clásico que definió una era.",
      price: 3200.00, stock: 50, category_id: catModa.id,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Chamarra de Cuero Vintage",
      description: "Cuero genuino con acabado envejecido. Perfecta para cualquier ocasión casual.",
      price: 4500.00, stock: 15, category_id: catModa.id,
      image: "https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?auto=format&fit=crop&w=800&q=80"
    },

    // --- HOGAR ---
    {
      name: "Silla Eames Replica",
      description: "Diseño minimalista, patas de madera y asiento ergonómico para tu oficina.",
      price: 1250.00, stock: 100, category_id: catHogar.id,
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Cafetera Italiana Moka Pot",
      description: "Prepara el auténtico espresso italiano en casa. Diseño clásico de aluminio.",
      price: 850.00, stock: 200, category_id: catHogar.id,
      image: "https://images.unsplash.com/photo-1520962889616-a5b6b1945ae3?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Lámpara de Escritorio Industrial",
      description: "Estilo loft con bombilla Edison incluida. Brazo ajustable de metal.",
      price: 1100.00, stock: 30, category_id: catHogar.id,
      image: "https://images.unsplash.com/photo-1507473888900-52e1ad254303?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Planta Monstera Deliciosa",
      description: "Planta natural de interior, purifica el aire y decora cualquier rincón.",
      price: 600.00, stock: 40, category_id: catHogar.id,
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"
    },

    // --- GAMING ---
    {
      name: "Teclado Mecánico RGB",
      description: "Switches azules clicky, retroiluminación personalizable y chasis de aluminio.",
      price: 1800.00, stock: 60, category_id: catGaming.id,
      image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Mouse Gamer Logitech G502",
      description: "Sensor HERO 25K, pesos ajustables y 11 botones programables.",
      price: 1200.00, stock: 80, category_id: catGaming.id,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "PlayStation 5 Controller",
      description: "DualSense Wireless Controller con retroalimentación háptica.",
      price: 1399.00, stock: 100, category_id: catGaming.id,
      image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&w=800&q=80"
    }
  ]

  for (const p of productos) {
    const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    await prisma.product.upsert({
      where: { slug: slug },
      update: {},
      create: {
        name: p.name, slug: slug, description: p.description, price: p.price, stock: p.stock,
        category_id: p.category_id, seller_id: vendedor.id,
        images: { create: { url: p.image } }
      }
    })
    console.log(`Producto: ${p.name}`)
  }
  console.log('Sembrado completo.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })