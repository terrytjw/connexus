// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Post } from "@prisma/client";
import { unlikePost } from "../../../../lib/prisma/post-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/post/{postId}/unlike
 *   post:
 *     description: Updates a Post object, removing a like from a User
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID of the Post to update.
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
 *         description: A single Post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | ErrorResponse | {}>
) {
  const { query, method } = req;
  const postId = parseInt(query.postId as string);
  const userId = parseInt(query.userId as string);

  switch (req.method) {
    case "POST":
      await handlePOST(postId, userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(postId: number, userId: number) {
    try {
      const response = await unlikePost(postId, userId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
