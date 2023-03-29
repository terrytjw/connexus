// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { UserTicket } from "@prisma/client";
import { ErrorResponse, handleError } from "../../../lib/prisma/prisma-helpers";
import {
  getUserTicketInfo,
  updateUserTicket,
} from "../../../lib/prisma/user-ticket-prisma";

/**
 * @swagger
 * /api/user-tickets/{userTicketId}:
 *   get:
 *     description: Returns a single UserTicket object
 *     parameters:
 *       - in: path
 *         name: userTicketId
 *         required: true
 *         description: String ID of the UserTicket to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single UserTicket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserTicket"
 *   post:
 *     description: Updates a single UserTicket object
 *     parameters:
 *       - in: object
 *         name: UserTicket
 *         required: true
 *         description: UserTicket object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/UserTicket"
 *     responses:
 *       200:
 *         description: A single UserTicket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserTicket"
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
  res: NextApiResponse<UserTicket | ErrorResponse | {}>
) {
  const { method, query, body } = req;

  switch (req.method) {
    case "GET": {
      let userId = query.userId ? parseInt(query.userId as string) : undefined;
      let ticketId = query.ticketId
        ? parseInt(query.ticketId as string)
        : undefined;
      await handleGET(ticketId, userId);
    }
    case "POST":
      const { userId, ticketId, ...userTicket } = body;
      await handlePOST(ticketId, userId, userTicket.userTicket as UserTicket);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(
    ticketId: number | undefined,
    userId: number | undefined
  ) {
    try {
      const response = await getUserTicketInfo(ticketId, userId);
      if (!response) {
        res.status(404).json({ message: "UserTicket not found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(
    ticketId: number,
    userId: number,
    userTicket: UserTicket
  ) {
    try {
      const response = await updateUserTicket(ticketId, userId, userTicket);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
