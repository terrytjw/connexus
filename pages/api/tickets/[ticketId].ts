// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../server-lib/prisma-util";
import { PrismaClient, Ticket } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/tickets/{ticketId}:
 *   get:
 *     description: Returns a single Ticket object
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: String ID of the Ticket to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Ticket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
 *   post:
 *     description: Updates a single Ticket object
 *     parameters:
 *       - in: object
 *         name: Ticket
 *         required: true
 *         description: Ticket object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Ticket"
 *     responses:
 *       200:
 *         description: A single Ticket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
 *   delete:
 *     description: Delete a single Ticket object
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: String ID of the Ticket to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Ticket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ticket | ErrorResponse | {}>
) {
  const { query, method } = req;
  let ticketId = parseInt(query.ticketId as string);

  switch (req.method) {
    case "GET":
      await handleGET(ticketId);
      break;
    case "POST":
      const ticket = JSON.parse(JSON.stringify(req.body)) as Ticket;
      await handlePOST(ticketId, ticket);
      break;
    case "DELETE":
      await handleDELETE(ticketId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(ticketId: number) {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: {
          ticketId: ticketId,
        },
      });

      if (!ticket) res.status(200).json({});
      else res.status(200).json(ticket);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(ticketId: number, ticket: Ticket) {
    try {
      const response = await prisma.ticket.update({
        where: {
          ticketId: ticketId,
        },
        data: { ...ticket, ticketId: undefined },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
      console.log(errorResponse);
    }
  }

  async function handleDELETE(ticketId: number) {
    try {
      const response = await prisma.ticket.delete({
        where: {
          ticketId: ticketId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
