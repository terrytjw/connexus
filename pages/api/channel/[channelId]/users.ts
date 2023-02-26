// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma-util";
import { PrismaClient, Channel, User } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/channel/{channelId}/users
 *   get:
 *     description: Returns a single Channel object
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: String ID of the Channel to retrieve.
 *         schema:
 *           type: string
 *       - in: query
 *         name: keyword
 *         description: The keyword to search users by. Searches member names
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of User objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | ErrorResponse | {}>
) {
  const { query, method } = req;
  const channelId = parseInt(query.channelId as string);
  const keyword = query.keyword as string;

  switch (req.method) {
    case "GET":
      await handleGET(channelId, keyword);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(channelId: number, keyword: string) {
    try {
      const channel = await prisma.channel.findFirst({
        where: {
          channelId: channelId
        },
        include: {
          members: {
            select: { userId: true, username: true, profilePic: true}
          }
        }
      });
      if (!channel) res.status(200).json({});
      const users = channel!.members
        .filter(x => x.username.includes(keyword));
      res.status(200).json(users);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
