// src/pages/api/upload-image.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import type { Request } from 'express'
import path from 'path'
import fs from 'fs'

// Configure multer storage (save files locally in /public/uploads)
const uploadFolder = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadFolder)
  },
  filename: (_req, file, cb) => {
    // Save file with original name plus timestamp to avoid conflicts
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext)
    cb(null, `${base}-${Date.now()}${ext}`)
  },
})

const upload = multer({ storage })

// Extend NextApiRequest to include multer file
interface NextApiRequestWithFile extends NextApiRequest {
  file?: Request['file']
}

// Disable Next.js default body parser to let multer handle it
export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper to run multer middleware in Next.js API route
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Run multer middleware
    await runMiddleware(req, res, upload.single('image'))

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Return file info (you can save filename/url in DB here)
    return res.status(200).json({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
    })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}