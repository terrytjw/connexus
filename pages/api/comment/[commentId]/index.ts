// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Comment } from "@prisma/client";
import { deleteComment, getComment, updateComment } from "../../../../lib/prisma/comment-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/comment/{commentId}
 *   get:
 *     description: Returns a single Comment object
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: String ID of the Comment to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Comment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 *   post:
 *     description: Updates a single Comment object
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: String ID of comment to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Comment"
 *     requestBody:
 *       name: Comment
 *       required: true
 *       description: Comment object to create
 *       application/json:
 *       schema:
 *         $ref: "#/components/schemas/Comment"
 *     responses:
 *       200:
 *         description: A single Comment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 *   delete:
 *     description: Delete a single Comment object
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: String ID of the Comment to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Comment object
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

  switch (req.method) {
    case "GET":
      await handleGET(commentId);
      break;
    case "POST":
      const comment = JSON.parse(JSON.stringify(req.body)) as Comment;
      await handlePOST(commentId, comment);
      break;
    case "DELETE":
      await handleDELETE(commentId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(commentId: number) {
    try {
      const comment = await getComment(commentId);

      if (!comment) res.status(200).json({});
      else res.status(200).json(comment);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(commentId: number, comment: Comment) {
    try {
      const response = await updateComment(commentId, comment);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(commentId: number) {
    try {
      const response = await deleteComment(commentId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
