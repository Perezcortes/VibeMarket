import { PrismaClient, users_role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const vendedorId = "vendedor-local-01"

  // 1. Usamos 'users' (en plural) porque así está en tu schema.prisma
  // Usamos users_role.vendedor para que TypeScript reconozca el Enum
  await prisma.users.upsert({
    where: { id: vendedorId },
    update: {},
    create: {
      id: vendedorId,
      email: "vendedor@vibe.com",
      password_hash: "pass123",
      full_name: "Vendedor de Prueba",
      role: users_role.vendedor // Usamos el Enum generado por Prisma
    }
  })

  const productosNuevos = [
    { id: 'tec-01', name: 'Teclado Mecánico', slug: 'teclado-mecanico-v1', price: 950.00, img: 'teclado.jpg' },
    { id: 'tec-02', name: 'Mouse Óptico', slug: 'mouse-optico-v1', price: 450.00, img: 'mouse.jpg' }
  ]

  for (const p of productosNuevos) {
    await prisma.products.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        seller_id: vendedorId,
        stock: 10,
        is_active: true,
        // Agregamos la imagen en la tabla correspondiente
        product_images: {
          create: {
            id: `img-${p.id}`,
            url: `/images/${p.img}`
          }
        }
      }
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())