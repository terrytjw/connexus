// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Community, Prisma} from "@prisma/client";
import { getCommunityById } from "../../../../lib/prisma/community-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/community/{communityId}/click:
 *   post:
 *     description: Increments a click for a single Community object
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         description: String ID of the Community to update.
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
  let communityId = parseInt(query.communityId as string);

  switch (req.method) {
    case "POST":
      await handlePOST(communityId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(communityId: number) {
    try {
      const communityToUpdate = await getCommunityById(communityId)
      const response = await prisma.community.update({
        where: {
          communityId: communityId
        },
        data: {
          clicks: communityToUpdate!.clicks + 1
        }
      })
      res.status(200).json(response);
    } catch (error) {
      console.log(error)
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
