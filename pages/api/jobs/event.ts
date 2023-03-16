import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { EventAnalyticsTimestamp, PrismaClient,} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventAnalyticsTimestamp[] | ErrorResponse>
) {
  const { method } = req;

  switch (method) {
    case "POST":
      await handlePOST();
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST() {
    try {
      const events = await prisma.event.findMany({
        include: {
          tickets: true,
          analyticsTimestamps: true,
          _count: { 
            select: { userLikes: true }
          }
        }
      });
      const timestamps = [];
      for (let event of events) {
        const prevAnalyticsTimestamp = event.analyticsTimestamps.at(-1);
        let ticketsSold =  0 - prevAnalyticsTimestamp!.ticketsSold;
        let revenue = 0
        for (let ticket of event.tickets) {
          ticketsSold += ticket.currentTicketSupply
          revenue += ticket.currentTicketSupply * ticket.price // we shall pretend promotions do not exist xd
        }
        let timestamp = await prisma.eventAnalyticsTimestamp.create({
          data: {
            ticketsSold: ticketsSold,
            revenue: revenue,
            clicks: event.clicks,
            likes: event._count.userLikes,
            event: {
              connect: { eventId: event.eventId }
            }
          }
        });
        timestamps.push(timestamp);
      }
      res.status(200).json(timestamps);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
