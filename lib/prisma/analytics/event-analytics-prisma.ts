import { PrismaClient } from "@prisma/client";
import { getEventsForAnalytics } from "../event-prisma";

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

export async function getEventAnalyticsByEvent(eventId: number, lowerBound: Date, upperBound: Date) {
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

export async function generateEventAnalyticsTimestamps() {
  const events = await getEventsForAnalytics();
  const timestamps = [];

  for (let event of events) {
    const prevAnalyticsTimestamp = event.analyticsTimestamps.at(-1);
    let ticketsSold =  0 - event.analyticsTimestamps
      .reduce((a, b) => a + b.ticketsSold, 0);
    let revenue = 0

    for (let ticket of event.tickets) {
      ticketsSold += ticket.currentTicketSupply
      revenue += ticketsSold * ticket.price // we shall pretend promotions do not exist xd
    }

    let timestamp = await prisma.eventAnalyticsTimestamp.create({
      data: {
        ticketsSold: ticketsSold,
        revenue: revenue,
        clicks: event.clicks - event.analyticsTimestamps
          .reduce((a, b) => a + b.clicks, 0),
        likes: event._count.userLikes,
        event: {
          connect: { eventId: event.eventId }
        }
      }
    });
    timestamps.push(timestamp);
  }
  return timestamps;
}