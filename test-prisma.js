const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

console.log(typeof prisma.activityLog)