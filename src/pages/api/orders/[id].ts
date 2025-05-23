import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const API_KEY = process.env.API_KEY || 'secret-api-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (['PUT', 'DELETE'].includes(req.method || '') && req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      const order = await prisma.order.findUnique({
        where: { id: String(id) },
        include: { orderItems: true },
      })
      if (!order) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(order)
    }
    else if (req.method === 'PUT') {
      const { status } = req.body
      if (!status) return res.status(400).json({ error: 'Status is required' })

      const updated = await prisma.order.update({
        where: { id: String(id) },
        data: { status },
        include: { orderItems: true },
      })
      return res.status(200).json(updated)
    }
    else if (req.method === 'DELETE') {
      await prisma.order.delete({ where: { id: String(id) } })
      return res.status(204).end()
    }
    else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}