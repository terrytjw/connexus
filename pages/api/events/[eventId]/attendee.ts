// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, User } from "@prisma/client";
import prisma from "../../../../lib/prisma";

/**
 * @swagger
 * /api/events/{commentId}/attendee
 *   comment:
 *     description: Retrieve a list of User objects that are attending the Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID of the Event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | ErrorResponse | {}>
) {
  const { query, method } = req;
  const eventId = parseInt(query.eventId as string);

  switch (req.method) {
    case "GET":
      await handleGET(eventId);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(eventId: number) {
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          eventId: eventId,
        },
      });

      const ticketIds = tickets.map((ticket) => ticket.ticketId);

      const response = await prisma.user.findMany({
        where: {
          tickets: {
            some: {
              ticketId: {
                in: ticketIds,
              },
            },
          },
        },
      });

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
