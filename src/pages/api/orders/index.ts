import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const API_KEY = process.env.API_KEY || 'secret-api-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (['POST', 'GET'].includes(req.method || '') && req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      const orders = await prisma.order.findMany({
        include: { orderItems: true },
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(orders)
    }
    else if (req.method === 'POST') {
      const {
        buyerName,
        buyerPhone,
        address,
        pincode,
        landmark,
        paymentType,
        orderItems, // array of {productId, sellerId, quantity, price}
      } = req.body

      if (!buyerName || !buyerPhone || !address || !orderItems?.length) {
        return res.status(400).json({ error: 'Missing required order details' })
      }

      const order = await prisma.order.create({
        data: {
          buyerName,
          buyerPhone,
          address,
          pincode,
          landmark,
          paymentType,
          status: 'pending',
          orderItems: { create: orderItems },
        },
        include: { orderItems: true },
      })
      return res.status(201).json(order)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}