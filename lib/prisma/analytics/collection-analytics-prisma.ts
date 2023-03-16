import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCollectionAnalyticsInRange(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      collection: {
        creatorId: userId
      }
    },
    include: {
      collection: {
        select: { collectionId: true, collectionName: true }
      }
    },
    orderBy: {
      date: 'asc'
    }
  })
}