// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma-util";
import { PrismaClient, Channel } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/channel/{channelId}/join:
 *   post:
 *     description: Adds a User to the list of a Channel's members
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: String ID of the Channel to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: User ID of the joining User
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Channel object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Channel"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Channel | ErrorResponse | {}>
) {
  const { query, method } = req;
  const channelId = parseInt(query.channelId as string);
  const userId = parseInt(query.userId as string);

  switch (method) {
    case "POST":
      await handlePOST(channelId, userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(channelId: number, userId: number) {
    try {
      const response = await prisma.channel.update({
        where: {
          channelId: channelId,
        },
        data: {
          members: {
            connect: {
              userId: userId
            }
          }
        },
        include: {
          members: true
        }
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}