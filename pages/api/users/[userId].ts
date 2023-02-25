import { Ticket } from "@prisma/client";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, User, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
type UserWithTicketsandMerch = Prisma.UserGetPayload<{ include: { tickets: true, merchandise: true } }>;

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     description: Returns a single User object
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: String ID of the User to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *   post:
 *     description: Updates a single User object
 *     parameters:
 *       - in: object
 *         name: User
 *         required: true
 *         description: User object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: A single User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *   delete:
 *     description: Delete a single User object
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: String ID of the User to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | ErrorResponse | {}>
) {
  const { query, method } = req;
  let userId = parseInt(query.userId as string);

  switch (req.method) {
    case "GET":
      await handleGET(userId);
      break;
    case "POST":
      const user = JSON.parse(JSON.stringify(req.body)) as UserWithTicketsandMerch;
      await handlePOST(userId, user);
      break;
    case "DELETE":
      await handleDELETE(userId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          userId: userId,
        },
        include: { tickets: true , merchandise : true},
      });

      if (!user) res.status(200).json({});
      else res.status(200).json(user);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(userId: number, userWithTicketsandMerch: UserWithTicketsandMerch) {
    try {
      const { tickets, merchandise, walletAddress, email, ...userInfo } = userWithTicketsandMerch;
      const ticketIdArray = tickets.map((ticket) => {
        const { ticketId } = ticket;
        return { ticketId: ticketId };
      });

      const merchIdArray = merchandise.map((merch) => {
        const { merchId } = merch;
        return { merchId: merchId };
      });

      const response = await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          ...userInfo,
          userId: undefined,
          tickets: { connect: [...ticketIdArray] },
          merchandise: { connect: [...merchIdArray] },
        },
      });

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(userId: number) {
    try {
      const response = await prisma.user.delete({
        where: {
          userId: userId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
