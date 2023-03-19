import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function groupCreatorEventAnalyticsByDate(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.groupBy({
    by: ['date'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      event: {
        is: { creatorId: userId }
      }
    },
    _sum: {
      ticketsSold: true,
      revenue: true,
      clicks: true,
      likes: true
    },
  })
}

export async function groupCreatorEventAnalyticsByEvent(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.groupBy({
    by: ['eventId'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      event: {
        is: { creatorId: userId }
      }
    },
    _sum: {
      ticketsSold: true,
      revenue: true,
      clicks: true,
      likes: true
    },
  })
}

export async function filterCreatorEventAnalyticsByEvent(eventId: number, lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      eventId: eventId
    },
    orderBy: {
      date: 'asc'
    },
  })
}