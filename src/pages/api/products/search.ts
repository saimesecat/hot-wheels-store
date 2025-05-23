import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { q, brand, minPrice, maxPrice, condition, tags } = req.query

  try {
    // Build filters dynamically
    const filters: any = {}

    if (brand) filters.brand = String(brand)
    if (condition) filters.condition = String(condition)
    if (minPrice || maxPrice) {
      filters.priceKWD = {}
      if (minPrice) filters.priceKWD.gte = Number(minPrice)
      if (maxPrice) filters.priceKWD.lte = Number(maxPrice)
    }
    if (tags) {
      // Expect comma-separated tags, e.g. tags=limited,muscle
      const tagsArray = String(tags).split(',').map(t => t.trim())
      filters.tags = {
        hasSome: tagsArray,
      }
    }

    // Search by name or modelCode if query 'q' exists
    const searchFilters = q
      ? {
          OR: [
            { name: { contains: String(q), mode: 'insensitive' } },
            { modelCode: { contains: String(q), mode: 'insensitive' } },
          ],
        }
      : {}

    const products = await prisma.product.findMany({
      where: {
        AND: [filters, searchFilters],
      },
      include: { images: true, seller: { select: { id: true, name: true } } },
      take: 100,
    })

    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ error: 'Search failed' })
  }
}