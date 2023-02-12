// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Post } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/post/{postId}
 *   get:
 *     description: Returns a single Post object
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: String ID of the Post to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *   put:
 *     description: Updates a single Post object
 *     parameters:
 *       - in: object
 *         name: Post
 *         required: true
 *         description: Post object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Post"
 *     responses:
 *       200:
 *         description: A single Post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *   delete:
 *     description: Delete a single Post object
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: String ID of the Post to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Post object
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

  switch (req.method) {
    case "GET":
      await handleGET(postId);
      break;
    case "PUT":
      const post = JSON.parse(JSON.stringify(req.body)) as Post;
      await handlePUT(postId, post);
      break;
    case "DELETE":
      await handleDELETE(postId);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(postId: number) {
    try {
      const post = await prisma.post.findUnique({
        where: {
          postId: postId
        },
      });

      if (!post) res.status(200).json({});
      else res.status(200).json(post);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePUT(postId: number, post: Post) {
    try {
      const response = await prisma.post.update({
        where: {
          postId: postId
        },
        data: { ...post },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(postId: number) {
    try {
      const response = await prisma.post.delete({
        where: {
          postId: postId
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
