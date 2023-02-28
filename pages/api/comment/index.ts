import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/comment:
 *   get:
 *     description: Returns a list of Comment objects
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
  const { method, body } = req;

  switch (method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const comment = JSON.parse(JSON.stringify(body)) as Comment;
      await handlePOST(comment);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const communities = await prisma.comment.findMany({});
      res.status(200).json(communities);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(comment: Comment) {
    try {
      const response = await prisma.comment.create({
        data: {
          ...comment,
        },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
