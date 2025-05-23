import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sellers = await prisma.seller.findMany({
        select: {
          id: true,
          name: true,
          whatsapp: true,
          profilePic: true,
          location: true,
          bio: true,
          isApproved: true,
          createdAt: true,
          products: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(sellers)
    } catch {
      return res.status(500).json({ error: 'Failed to fetch sellers' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}