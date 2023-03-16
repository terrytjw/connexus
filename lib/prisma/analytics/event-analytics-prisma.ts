import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getEventClicksInRange(lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { clicks: true, date: true },
    include: { event: true }
  })
}

export async function getEventRevenueInRange(lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { revenue: true, date: true },
    include: { event: true }
  })
}

export async function getEventTicketsSoldInRange(lowerBound: Date, upperBound: Date) {
  return prisma.eventAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { ticketsSold: true, date: true },
    include: { event: true }
  })
}

export async function getEventAttendanceInRange(lowerBound: Date, upperBound: Date) {}