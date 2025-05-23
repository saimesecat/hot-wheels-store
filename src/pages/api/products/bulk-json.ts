import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  const { products } = req.body
  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: "Missing 'products' array in body" })
  }
  try {
    await prisma.product.createMany({ data: products })
    res.status(201).json({ success: true, count: products.length })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}