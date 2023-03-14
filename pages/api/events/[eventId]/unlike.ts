// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Comment } from "@prisma/client";
import { unlikeEvent } from "../../../../lib/prisma/event-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/events/{commentId}/unlike
 *   comment:
 *     description: Updates an Event object with a unlike from a User
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID of the Event to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: User ID of the liking User
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
  const eventId = parseInt(query.eventId as string);
  const userId = parseInt(query.userId as string);

  switch (req.method) {
    case "POST":
      await handlePOST(eventId, userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(eventId: number, userId: number) {
    try {
      const response = await unlikeEvent(eventId, userId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
