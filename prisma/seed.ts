import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create one seller
  const seller = await prisma.seller.create({
    data: {
      name: 'Test Seller',
      whatsapp: '+919999999999',
      profilePic: null,
      location: 'Mumbai',
      bio: 'Vintage car collector',
      isApproved: true,
    },
  })

  // Create a product for this seller
  const product = await prisma.product.create({
    data: {
      name: 'Hot Wheels Muscle Racer',
      brand: 'Hot Wheels',
      yearSeries: 2025,
      yearCar: 2025,
      modelCode: 'HW2025MR001',
      color: 'Red',
      condition: 'mint',
      priceINR: 299,
      priceKWD: 1,
      quantity: 10,
      description: 'Limited edition 2025 Muscle Racer.',
      tags: ['limited', 'muscle', '2025'],
      sku: 'HW-MR-2025-01',
      seller: { connect: { id: seller.id } },
      images: {
        create: [
          { url: 'https://via.placeholder.com/400x300?text=Car+Front' },
          { url: 'https://via.placeholder.com/400x300?text=Car+Back' },
        ],
      },
    },
  })

  // Create an admin user (username: admin, password: adminpass)
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'adminpass',
    },
  })

  console.log('Seed data added successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })