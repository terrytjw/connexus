// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { checkIn } from "../../../../lib/prisma/user-ticket-prisma";

/**
 * @swagger
 * /api/tickets/{ticketId}/checkin
 *   comment:
 *     description: Updates an Ticket object with as user checked in
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: Ticket ID of the Ticket to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: User ID of the checkin user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Ticket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event | ErrorResponse | {}>
) {
  const { query, method } = req;
  const ticketId = parseInt(query.ticketId as string);
  const userId = parseInt(query.userId as string);

  switch (req.method) {
    case "POST":
      await handlePOST(ticketId, userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(ticketId: number, userId: number) {
    try {
      const response = await checkIn(ticketId, userId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
