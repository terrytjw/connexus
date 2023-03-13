import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient,} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | ErrorResponse>
) {
  const { method } = req;

  switch (method) {
    case "POST":
      await handlePOST();
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST() {
    try {
      const posts = await prisma.post.findMany({
        include: {
          _count: {
            select: { likes: true, comments: true }
          }
        }
      });
      for (let post of posts) {
        await prisma.postLikesTimestamp.create({
          data: {
            likes: post._count.likes,
            post: {
              connect: {
                postId: post.postId
              }
            }
          }
        });
        await prisma.postCommentsTimestamp.create({
          data: {
            comments: post._count.comments,
            post: {
              connect: {
                postId: post.postId
              }
            }
          }
        });
      }
      res.status(200).json(true);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
