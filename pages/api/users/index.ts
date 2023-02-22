import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Returns a list of User objects
 *     responses:
 *       200:
 *         description: A list of User objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *   post:
 *     description: Create a User object
 *     parameters:
 *       - in: object
 *         name: User
 *         required: true
 *         description: User object to create
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: The created User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | ErrorResponse>
) {
  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const user = JSON.parse(JSON.stringify(req.body)) as User;
      await handlePOST(user);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(user: User) {
    try {
      const response = await prisma.user.create({
        data: { ...user, userId: undefined },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}