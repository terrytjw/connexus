// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Event } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../../prisma/generated/client";

type Data = {
  name: string;
};
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/events/{eventId}:
 *   get:
 *     description: Returns a single Event object
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the Event to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *   put:
 *     description: Updates a single Event object
 *     parameters:
 *       - in: object
 *         name: Event
 *         required: true
 *         description: Event object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Event"
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
  res: NextApiResponse<Event | null>
) {
  if (req.method === "GET") {
    let eventId = req.query.eventId as string;

    const event = await prisma.event.findUnique({
      where: {
        eventId: parseInt(eventId),
      },
    });
    res.status(200).json(event);
  }
}
