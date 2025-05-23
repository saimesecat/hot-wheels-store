import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const API_KEY = process.env.API_KEY || 'secret-api-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple API key auth for unsafe methods
  if (['POST'].includes(req.method || '') && req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      // Pagination query params
      const page = parseInt((req.query.page as string) || '1', 10)
      const limit = parseInt((req.query.limit as string) || '20', 10)
      const skip = (page - 1) * limit

      const products = await prisma.product.findMany({
        include: {
          images: true,
          seller: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(products)
    }
    else if (req.method === 'POST') {
      const {
        name, brand, yearSeries, yearCar, modelCode, color, condition,
        priceINR, priceKWD, quantity, description, tags, sku, sellerId, images,
      } = req.body

      // Basic validation
      if (!name || !brand || !sellerId) {
        return res.status(400).json({ error: 'Missing required fields: name, brand, sellerId' })
      }

      const product = await prisma.product.create({
        data: {
          name,
          brand,
          yearSeries,
          yearCar,
          modelCode,
          color,
          condition,
          priceINR,
          priceKWD,
          quantity,
          description,
          tags,
          sku,
          seller: { connect: { id: sellerId } },
          images: {
            create: Array.isArray(images) ? images.map((url: string) => ({ url })) : [],
          },
        },
        include: { images: true, seller: true },
      })
      return res.status(201).json(product)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}