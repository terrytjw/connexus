import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPostAnalyticsInRange(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.postAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      post: {
        creatorId: userId
      }
    },
    include: { post: true },
    orderBy: {
      date: 'asc'
    }
  })
}