// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/comment/{commentId}/unlike
 *   comment:
 *     description: Updates a Comment object, removing a like from a User
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Comment ID of the Comment to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: User ID of the unliking User
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Comment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Comment | ErrorResponse | {}>
) {
  const { query, method } = req;
  const commentId = parseInt(query.commentId as string);
  const userId = parseInt(query.userId as string);

  switch (req.method) {
    case "POST":
      await handlePOST(commentId, userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(
    commentId: number,
    userId: number
  ) {
    try {
      const response = await prisma.comment.update({
        where: {
          commentId: commentId,
        },
        data: {
          likes: {
            disconnect: {
              userId: userId,
            },
          },
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
