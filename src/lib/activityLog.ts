import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function logActivity(
  action: string,
  entityId: string,
  entityType: string,
  description?: string
) {
  await prisma.activityLog.create({
    data: { action, entityId, entityType, description },
  })
}