import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient,} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | ErrorResponse>
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
        include: { tickets: true, eventTicketsSoldTimestamps: true }
      });
      for (let event of events) {
        const prevTicketsSoldTimestamp = event.eventTicketsSoldTimestamps.at(-1);
        let ticketsSold = 0 - prevTicketsSoldTimestamp!.ticketsSold;
        let revenue = 0
        for (let ticket of event.tickets) {
          ticketsSold += ticket.currentTicketSupply
          revenue += ticket.currentTicketSupply * ticket.price // we shall pretend promotions do not exist xd
        }
        await prisma.eventTicketsSoldTimestamp.create({
          data: {
            ticketsSold: ticketsSold,
            event: {
              connect: {
                eventId: event.eventId
              }
            }
          }
        });
        await prisma.eventRevenueTimestamp.create({
          data: {
            revenue: revenue,
            event: {
              connect: {
                eventId: event.eventId
              }
            }
          }
        })
      }
      res.status(200).json(true);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}