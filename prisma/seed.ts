import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Crear usuario cliente
  const user = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      email: 'cliente@test.com',
      full_name: 'Cliente Prueba',
      password_hash: '123',
      role: 'comprador'
    }
  })

  // 2. Crear ticket
  await prisma.supportTicket.create({
    data: {
      user_id: user.id,
      subject: 'Producto llegó roto',
      message: 'Hola, mi pedido #123 llegó destrozado.',
      priority: 'alta',
      status: 'abierto'
    }
  })
}
main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })