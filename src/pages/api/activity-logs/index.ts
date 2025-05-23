import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,  // limit to latest 100 logs for performance
  })

  res.status(200).json(logs)
}