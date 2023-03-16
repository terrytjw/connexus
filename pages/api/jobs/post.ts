import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PostAnalyticsTimestamp, PrismaClient,} from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostAnalyticsTimestamp[] | ErrorResponse>
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
          },
          channel: {
            include: {
              _count: {
                select: { members: true }
              }
            }
          }
        }
      });
      const timestamps = [];
      for (let post of posts) {
        let timestamp = await prisma.postAnalyticsTimestamp.create({
          data: {
            likes: post._count.likes,
            comments: post._count.comments,
            engagement: ( post._count.likes + post._count.comments) / (post.channel._count.members), // doesnt account for duplicate comments yet
            post: {
              connect: { postId: post.postId }
            }
          }
        })
        timestamps.push(timestamp)
      }
      res.status(200).json(timestamps);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
