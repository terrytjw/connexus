// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     description: Returns a single User object
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: String username of the User to retrieve.
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
 *         name: username
 *         required: true
 *         description: String username of the User to delete.
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
  let username = query.username as string;

  switch (req.method) {
    case "GET":
      await handleGET(username);
      break;
    case "POST":
      const user = JSON.parse(JSON.stringify(req.body)) as User;
      await handlePOST(username, user);
      break;
    case "DELETE":
      await handleDELETE(username);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) res.status(200).json({});
      else res.status(200).json(user);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(username: string, user: User) {
    try {
      const response = await prisma.user.update({
        where: {
          username: username,
        },
        data: { ...user, username: undefined },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(username: string) {
    try {
      const response = await prisma.user.delete({
        where: {
          username: username,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
