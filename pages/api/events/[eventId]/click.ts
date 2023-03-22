// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Event, Prisma} from "@prisma/client";
import {
  retrieveEventInfo,
} from "../../../../lib/prisma/event-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/events/{eventId}/click:
 *   post:
 *     description: Increments a click for a single Event object
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the Event to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event | ErrorResponse | {}>
) {

  const { query, method } = req;
  let eventId = parseInt(query.eventId as string);

  switch (req.method) {
    case "POST":
      await handlePOST(eventId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(eventId: number) {
    try {
      const eventToUpdate = await retrieveEventInfo(eventId)
      const response = await prisma.event.update({
        where: {
          eventId: eventId
        },
        data: {
          clicks: eventToUpdate!.clicks + 1
        }
      })
      res.status(200).json(response);
    } catch (error) {
      console.log(error)
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
