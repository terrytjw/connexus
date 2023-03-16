import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getEventAnalyticsInRange(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      event: {
        creatorId: userId
      }
    },
    include: { 
      event: {
        select: { eventId: true, eventName: true }
      }
    },
    orderBy: {
      date: 'asc'
    }
  })
}