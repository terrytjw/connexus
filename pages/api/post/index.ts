import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Post } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/post:
 *   get:
 *     description: Returns a list of Post objects
 *     responses:
 *       200:
 *         description: A list of Post objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Post"
 *   post:
 *     description: Create a Post object
 *     parameters:
 *       - in: object
 *         name: Post
 *         required: true
 *         description: Post object to create
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Post"
 *     responses:
 *       200:
 *         description: The created Post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *   put:
 *     description: Update a Post object
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
 *         description: The updated Post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *   delete:
 *     description: Delete a Post object
 *     parameters:
 *       - in: object
 *         name: Post
 *         required: true
 *         description: Post object to delete
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Post"
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
  res: NextApiResponse<Post[] | ErrorResponse>
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const { post, userId, channelId } : { post: Post, userId: number, channelId: number }= JSON.parse(JSON.stringify(body))
      await handlePOST(post, userId, channelId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const posts = await prisma.post.findMany({
      });
      res.status(200).json(posts);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(post: Post, userId: number, channelId: number) {
    try {
      const response = await prisma.post.create({
        data: { 
          ...post,
          user: {
            connect: {
              userId: userId
            }
          },
          channel: {
            connect: {
              channelId: channelId
            }
          }
        }
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}