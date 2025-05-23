import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const API_KEY = process.env.API_KEY || 'secret-api-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  // Simple API key auth for unsafe methods
  if (['PUT', 'PATCH', 'DELETE'].includes(req.method || '') && req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      const product = await prisma.product.findUnique({
        where: { id: String(id) },
        include: { images: true, seller: { select: { id: true, name: true } } },
      })
      if (!product) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(product)
    }
    else if (req.method === 'PUT') {
      const {
        name, brand, yearSeries, yearCar, modelCode, color, condition,
        priceINR, priceKWD, quantity, description, tags, sku, sellerId,
      } = req.body

      if (!name || !brand || !sellerId) {
        return res.status(400).json({ error: 'Missing required fields: name, brand, sellerId' })
      }

      const updated = await prisma.product.update({
        where: { id: String(id) },
        data: {
          name, brand, yearSeries, yearCar, modelCode, color, condition,
          priceINR, priceKWD, quantity, description, tags, sku,
          seller: { connect: { id: sellerId } },
        },
        include: { images: true, seller: true },
      })
      return res.status(200).json(updated)
    }
    else if (req.method === 'PATCH') {
      const { addImages, removeImageIds, quantity } = req.body
      const productId = String(id)

      if (typeof quantity === 'number') {
        await prisma.product.update({
          where: { id: productId },
          data: { quantity },
        })
      }

      if (Array.isArray(addImages) && addImages.length > 0) {
        await prisma.image.createMany({
          data: addImages.map((url: string) => ({
            url,
            productId,
          })),
        })
      }

      if (Array.isArray(removeImageIds) && removeImageIds.length > 0) {
        await prisma.image.deleteMany({
          where: {
            id: { in: removeImageIds },
            productId,
          },
        })
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true, seller: { select: { id: true, name: true } } },
      })
      return res.status(200).json(product)
    }
    else if (req.method === 'DELETE') {
      await prisma.product.delete({ where: { id: String(id) } })
      return res.status(204).end()
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}