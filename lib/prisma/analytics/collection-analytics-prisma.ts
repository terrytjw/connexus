import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function groupCreatorCollectionAnalyticsByDate(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.groupBy({
    by: ['date'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      collection: {
        is: { creatorId: userId }
      }
    },
    _sum: {
      merchSold: true,
      revenue: true,
      clicks: true
    },
  })
}

export async function groupCreatorCollectionAnalyticsByCollection(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.groupBy({
    by: ['collectionId'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      collection: {
        is: { creatorId: userId }
      }
    },
    _sum: {
      merchSold: true,
      revenue: true,
      clicks: true
    },
  })
}

export async function filterCreatorCollectionAnalyticsByCollection(collectionId: number, lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      collectionId: collectionId
    },
    orderBy: {
      date: 'asc'
    },
  })
}