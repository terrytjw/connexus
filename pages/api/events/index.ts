import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Event } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/events:
 *   get:
 *     description: Returns a list of Event objects
 *     responses:
 *       200:
 *         description: A list of Event objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Event"
 *   post:
 *     description: Create a Event object
 *     parameters:
 *       - in: object
 *         name: Event
 *         required: true
 *         description: Event object to create
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Event"
 *     responses:
 *       200:
 *         description: The created Event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event[] | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  console.log(session);

  if (!session) {
    res.status(401).json({ error: "401", message: "Unauthorized" });
  }

  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const event = JSON.parse(JSON.stringify(req.body)) as Event;
      await handlePOST(event);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const events = await prisma.event.findMany();
      res.status(200).json(events);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(event: Event) {
    try {
      const response = await prisma.event.create({
        data: { ...event, eventId: undefined },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
