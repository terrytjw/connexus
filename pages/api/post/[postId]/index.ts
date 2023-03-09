// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Post } from "@prisma/client";
import {
  checkIfStringIsBase64,
  retrieveImageUrl,
  uploadImage,
} from "../../../../lib/supabase";
import { POST_BUCKET } from "../../../../lib/constant";
import { deletePost, getPost, updatePost } from "../../../../lib/prisma/post-prisma";

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
 *   post:
 *     description: Updates a single Post object
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: String ID of the Post to update.
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Post"
 *     requestBody:
 *       name: Post
 *       required: true
 *       description: Post object to update
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Post"
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

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
    case "POST":
      const post = JSON.parse(JSON.stringify(req.body)) as Post;
      await handlePOST(postId, post);
      break;
    case "DELETE":
      await handleDELETE(postId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(postId: number) {
    try {
      const post = await getPost(postId);
      if (!post) res.status(200).json({});
      else res.status(200).json(post);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(postId: number, post: Post) {
    try {
      const { media } = post;
      let updatedMedia = [];

      for (let pic of media) {
        if (!checkIfStringIsBase64(pic)) {
          updatedMedia.push(pic);
          continue;
        }
        let picPath = "";
        const { data, error } = await uploadImage(POST_BUCKET, pic);

        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data) picPath = await retrieveImageUrl(POST_BUCKET, data.path);

        updatedMedia.push(picPath);
      }

      const updatedPostInfo = {
        ...post,
        media: updatedMedia,
      };
      const response = await updatePost(postId, updatedPostInfo);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(postId: number) {
    try {
      const response = await deletePost(postId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
