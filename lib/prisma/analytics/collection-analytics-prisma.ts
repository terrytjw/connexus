import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCollectionClicksInRange(lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { clicks: true, date: true },
    include: { collection: true }
  })
}

export async function getCollectionRevenueInRange(lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { revenue: true, date: true },
    include: { collection: true }
  })
}