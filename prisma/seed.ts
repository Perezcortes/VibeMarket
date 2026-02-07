import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Vendedor de prueba
  const seller = await prisma.user.upsert({
    where: { email: 'vendedor@vibemarket.com' },
    update: {},
    create: {
      email: 'vendedor@vibemarket.com',
      password_hash: 'hash_seguro_mx', 
      full_name: 'Vendedor Local Oaxaca',
      role: 'vendedor',
    },
  })

  // 2. Datos con Precios en MXN y URLs de Amazon/Mercado Libre
  const categoriesData = [
    {
      name: 'Tecnología',
      slug: 'tecnologia',
      products: [
        { name: 'Monitor Gamer 27" 144Hz', price: 4299.00, stock: 8, img: 'https://m.media-amazon.com/images/I/715i-ATf2TL._AC_SL1500_.jpg' },
        { name: 'Laptop Ryzen 7 16GB RAM', price: 15800.00, stock: 5, img: 'https://m.media-amazon.com/images/I/4187QoGHOIL._AC_SL1000_.jpg' },
      ],
    },
    {
      name: 'Moda',
      slug: 'moda',
      products: [
        { name: 'Sudadera con Capucha Negra', price: 599.00, stock: 30, img: 'https://m.media-amazon.com/images/I/715gjzOGFrL._AC_SX679_.jpg' },
        { name: 'Tenis Deportivos Blancos', price: 1250.00, stock: 20, img: 'https://m.media-amazon.com/images/I/515jO4jkfeL._AC_SY535_.jpg' },
      ],
    },
    {
      name: 'Hogar',
      slug: 'hogar',
      products: [
        { name: 'Cafetera de Goteo 12 Tazas', price: 890.00, stock: 15, img: 'https://m.media-amazon.com/images/I/71Msl-tdCOL._AC_SL1500_.jpg' },
        { name: 'Set de Utensilios Cocina', price: 450.00, stock: 25, img: 'https://m.media-amazon.com/images/I/71-XBlFd8UL._AC_SL1500_.jpg' },
      ],
    },
    {
      name: 'Deportes',
      slug: 'deportes',
      products: [
        { name: 'Balón de Fútbol No. 5', price: 380.00, stock: 40, img: 'https://m.media-amazon.com/images/I/61kSd78fm0L._AC_SL1500_.jpg' },
        { name: 'Cuerda para Saltar Pro', price: 199.00, stock: 100, img: 'https://m.media-amazon.com/images/I/61iC-MKt13L._AC_SL1500_.jpg' },
      ],
    },
    {
      name: 'Juguetes',
      slug: 'juguetes',
      products: [
        { name: 'Juego de Mesa Estrategia', price: 750.00, stock: 12, img: 'https://m.media-amazon.com/images/I/71k-3QqiFeL._AC_SL1256_.jpg' },
        { name: 'Figura de Acción Coleccionable', price: 420.00, stock: 18, img: 'https://m.media-amazon.com/images/I/81WJgi64WKL._AC_SL1500_.jpg' },
      ],
    },
    {
      name: 'Mascotas',
      slug: 'mascotas',
      products: [
        { name: 'Alimento Premium Perro 10kg', price: 1100.00, stock: 10, img: 'https://m.media-amazon.com/images/I/81uVVZB6SFL._AC_SL1500_.jpg' },
        { name: 'Juguete Mordedera Pro', price: 145.00, stock: 50, img: 'https://m.media-amazon.com/images/I/71CJqibxV3L._AC_SL1000_.jpg' },
      ],
    },
  ]

  // 3. Lógica de inserción
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    })

    for (const p of cat.products) {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: `${cat.slug}-${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          price: p.price,
          stock: p.stock,
          seller_id: seller.id,
          category_id: category.id,
          images: {
            create: { url: p.img }
          }
        },
      })
    }
  }

  console.log('Seed con precios en MXN y URLs externas completado.')
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); })