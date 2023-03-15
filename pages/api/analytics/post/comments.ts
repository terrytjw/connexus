// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Address, PostLikesTimestamp } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/addresses/{addressId}:
 *   get:
 *     description: Returns a single Address object
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         description: String ID of the Address to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Address object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Address"
 *   post:
 *     description: Updates a single Address object
 *     parameters:
 *       - in: object
 *         name: Address
 *         required: true
 *         description: Address object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Address"
 *     responses:
 *       200:
 *         description: A single Address object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Address"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostLikesTimestamp[] | ErrorResponse | {}>
) {
  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      const response = await getPostLikesInRange(lastWeek, today);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
