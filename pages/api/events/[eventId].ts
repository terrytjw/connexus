// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Event } from "@prisma/client";

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
 *   post:
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
 *   delete:
 *     description: Delete a single Event object
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the Event to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Event object
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
    case "GET":
      await handleGET(eventId);
      break;
    case "POST":
      const event = JSON.parse(JSON.stringify(req.body)) as Event;
      await handlePOST(eventId, event);
      break;
    case "DELETE":
      await handleDELETE(eventId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(eventId: number) {
    try {
      const event = await prisma.event.findUnique({
        where: {
          eventId: eventId,
        },
      });

      if (!event) res.status(200).json({});
      else res.status(200).json(event);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(eventId: number, event: Event) {
    try {
      const response = await prisma.event.update({
        where: {
          eventId: eventId,
        },
        data: { ...event, eventId: undefined },
      });
      res.status(200).json(response);
      const location = event.location; 
      const title = event.title; 
      const start = event.startDate; 
      const description = event.description; 
      //const tickets = event.tickets; 

    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
      console.log(errorResponse);
    }
  }

  async function handleDELETE(eventId: number) {
    try {
      const response = await prisma.event.delete({
        where: {
          eventId: eventId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
