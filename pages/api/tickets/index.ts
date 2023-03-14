import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Ticket } from "@prisma/client";
import { createTicket, filterTickets } from "../../../lib/prisma/ticket-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     description: Returns a list of Ticket objects
 *     responses:
 *       200:
 *         description: A list of Ticket objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Ticket"
 *   ticket:
 *     description: Create a Ticket object. Creator's userId and channel's channelId are required
 *     requestBody:
 *       name: Ticket
 *       required: true
 *       description: Ticket object to create
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Ticket"
 *     responses:
 *       200:
 *         description: The created Ticket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
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
  res: NextApiResponse<Ticket[] | Ticket | ErrorResponse>
) {
  const { method, query, body } = req;

  switch (method) {
    case "GET":
      const userId = query.userId
        ? parseInt(query.userId as string)
        : undefined;
      await handleGET(userId);
      break;
    case "POST":
      const ticket = JSON.parse(JSON.stringify(body)) as Ticket;
      await handlePOST(ticket);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(userId: number | undefined) {
    try {
      const tickets = await filterTickets(userId);
      res.status(200).json(tickets);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(ticket: Ticket) {
    try {
      const response = await createTicket(ticket);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
