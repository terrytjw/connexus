// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Comment } from "@prisma/client";
import {
  likeEvent,
  retrieveTrendingEvents,
} from "../../../lib/prisma/event-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/events/{EventId}/trending
 *   comment:
 *     description: Return a list of trending events
 *     responses:
 *       200:
 *         description: A list of event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event | ErrorResponse | {}>
) {
  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const response = await retrieveTrendingEvents();
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
