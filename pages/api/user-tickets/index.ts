import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { Event, PrismaClient, Ticket, UserTicket } from "@prisma/client";
import { createTicket, filterTickets } from "../../../lib/prisma/ticket-prisma";
import {
  TicketWithUser,
  retrieveExpiredEvents,
  retrieveVisitedEvents,
  saveUserTicket,
  saveUserTickets,
} from "../../../lib/prisma/user-ticket-prisma";

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     description: Returns a list of UserTicket objects
 *     responses:
 *       200:
 *         description: A list of UserTicket objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserTicket"
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event[] | ErrorResponse>
) {
  const { method, query, body } = req;
  let userId;
  let ticketId;
  switch (method) {
    case "GET":
      userId = query.userId ? parseInt(query.userId as string) : undefined;
      ticketId = query.ticketId
        ? parseInt(query.ticketId as string)
        : undefined;

      const viewVisitedEvent = query.viewVisitedEvent === "true"; // temp to switch between viewPastEvent and viewExpiredEvent
      await handleGET(userId, ticketId, viewVisitedEvent);
      break;
    case "POST":
      userId = body.userId ? parseInt(body.userId as string) : undefined;
      ticketId = body.ticketId ? parseInt(body.ticketId as string) : undefined;

      await handlePOST(ticketId, userId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(
    userId: number | undefined,
    ticketId: number | undefined,
    viewVisitedEvent: boolean
  ) {
    try {
      if (viewVisitedEvent) {
        const userTickets = await retrieveVisitedEvents(ticketId, userId);
        res.status(200).json(userTickets);
      } else {
        const userTickets = await retrieveExpiredEvents(ticketId, userId);
        res.status(200).json(userTickets);
      }
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(
    ticketId: number | undefined,
    userId: number | undefined
  ) {
    try {
      const response = await saveUserTicket(ticketId, userId);
      res.status(200).json([]);
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
