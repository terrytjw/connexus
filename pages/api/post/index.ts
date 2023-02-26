import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Post } from "@prisma/client";
import { retrieveImageUrl, uploadImage } from "../../../lib/supabase";
import { POST_BUCKET } from "../../../lib/constant";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/post:
 *   get:
 *     description: Returns a list of Post objects in a specific channel. Includes list of userIds liking the post
 *     parameters:
 *       - in: query
 *         name: channelId
 *         required: true
 *         description: Channel ID of the channel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Post objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Post"
 *   post:
 *     description: Create a Post object. Creator's userId and channel's channelId are required
 *     requestBody:
 *       name: Post
 *       required: true
 *       description: Post object to create
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Post"
 *     responses:
 *       200:
 *         description: The created Post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb'
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | ErrorResponse>
) {
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      const channelId = parseInt(query.channelId as string);
      await handleGET(channelId);
      break;
    case "POST":
      const post = JSON.parse(JSON.stringify(body)) as Post
      await handlePOST(post);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(channelId: number) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          channelId: channelId
        },
        include: {
          likes: {
            select: {
              userId: true
            }
          },
          creator: {
            select: {
              userId: true,
              profilePic: true,
              username: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
      res.status(200).json(posts);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(post: Post) {
    try {
      const { media } = post;
      let updatedMedia = [];

      for (let pic of media) {
        let picPath = "";
        const { data, error } = await uploadImage(
          POST_BUCKET,
          pic
        );

        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data)
          picPath = await retrieveImageUrl(
            POST_BUCKET,
            data.path
          );
        
        updatedMedia.push(picPath);
      }

      const updatedPostInfo = {
        ...post,
        media: updatedMedia
      };
      const response = await prisma.post.create({
        data: { ...post, postId: undefined }
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}