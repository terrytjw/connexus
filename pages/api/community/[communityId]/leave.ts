// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma-util";
import { PrismaClient, Community, ChannelType } from "@prisma/client";
import { leaveChannel } from "../../../../lib/channel";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/community/{communityId}/leave:
 *   post:
 *     description: Removes a User to the list of a Community's members
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         description: String ID of the Community to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: User ID of the leaving User
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Community object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Community | ErrorResponse | {}>
) {
  const { query, method } = req;
  const communityId = parseInt(query.communityId as string);
  const userId = parseInt(query.userId as string);

  switch (method) {
    case "POST":
      await handlePOST(communityId, userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(communityId: number, userId: number) {
    try {
      const communityToLeave = await prisma.community.update({
        where: {
          communityId: communityId,
        },
        data: {
          members: {
            disconnect: {
              userId: userId
            }
          },
        },
        include: {
          channels: {
            orderBy: {
              channelId: 'asc'
            }
          }
        }
      });
      await leaveChannel(communityToLeave.channels[0].channelId, userId);
      const response = await prisma.community.findFirst({
        where: {
          communityId: communityId
        },
        include: {
          members: {
            select: { userId: true }
          },
          channels: {
            include: {
              members: {
                select: { userId: true, username: true, profilePic: true }
              }
            }
          }
        }
      })
      res.status(200).json(response!);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}