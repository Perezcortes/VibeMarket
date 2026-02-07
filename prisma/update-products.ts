import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const updates = [
    { name: 'Teclado Mecánico RGB', imageName: 'teclado.jpg', category: 'Tecnología' },
    { name: 'Mouse Gamer Inalámbrico', imageName: 'mouse.jpg', category: 'Tecnología' },
    { name: 'Monitor 4K 27"', imageName: 'monitor.jpg', category: 'Tecnología' },
    { name: 'Auriculares Noise Cancelling', imageName: 'auriculares.jpg', category: 'Tecnología' },
    { name: 'Webcam 1080p Full HD', imageName: 'webcam.jpg', category: 'Tecnología' },
    { name: 'Soporte para Laptop', imageName: 'soporte.jpg', category: 'Tecnología' },
    { name: 'Hub USB-C 7 en 1', imageName: 'hub.jpg', category: 'Tecnología' },
    { name: 'Alfombrilla XL Premium', imageName: 'mousepad.jpg', category: 'Tecnología' },
    { name: 'Luz LED de Monitor', imageName: 'luz.jpg', category: 'Tecnología' }
  ]

  console.log('Actualizando productos con categorías e imágenes...')

  for (const item of updates) {
    await prisma.product.updateMany({
      where: { name: item.name },
      data: {
        imageName: item.imageName,
        category: item.category,
        isActive: true // Esto solucionará el error rojo en tu VS Code
      }
    })
  }

  console.log('¡Productos actualizados con éxito!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())