import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse'
import Busboy from 'busboy'

const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const bb = new (Busboy as any)({ headers: req.headers })
  let products: any[] = []

  bb.on('file', (_: string, file: NodeJS.ReadableStream) => {
    file.pipe(
      parse({ columns: true, trim: true })
        .on('data', (row) => products.push(row))
        .on('end', async () => {
          try {
            await prisma.product.createMany({ data: products })
            res.status(201).json({ success: true, count: products.length })
          } catch (err) {
            res.status(500).json({ error: String(err) })
          }
        })
    )
  })

  req.pipe(bb)
}