import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Comment } from "@prisma/client";
import { createComment, getAllCommentsOnPost } from "../../../lib/prisma/comment-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/comment:
 *   get:
 *     description: Returns a list of Comment objects in a Post
 *     parameters:
 *       - in: query
 *         name: postId
 *         required: true
 *         description: String ID of the Post to retrieve comments from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Comment objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Comment"
 *   post:
 *     description: Create a Comment object. postId and userId are required.
 *     requestBody:
 *       name: Comment
 *       required: true
 *       description: Comment object to create
 *       application/json:
 *       schema:
 *         $ref: "#/components/schemas/Comment"
 *     responses:
 *       200:
 *         description: The created Comment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Comment[] | ErrorResponse>
) {
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      const postId = parseInt(query.postId as string);
      await handleGET(postId);
      break;
    case "POST":
      const comment = JSON.parse(JSON.stringify(body)) as Comment;
      await handlePOST(comment);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(postId: number) {
    try {
      const communities = await getAllCommentsOnPost(postId);
      res.status(200).json(communities);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(comment: Comment) {
    try {
      const response = await createComment(comment);
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
