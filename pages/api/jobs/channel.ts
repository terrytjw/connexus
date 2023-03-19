import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { ChannelAnalyticsTimestamp, PrismaClient,} from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChannelAnalyticsTimestamp[] | ErrorResponse>
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
      const channels = await prisma.channel.findMany({
        include: {
          posts: {
            include: {
              _count: {
                select: { likes: true, comments: true }
              }
            }
          },
          _count: {
            select: { members: true, posts: true }
          }
        }
      });
      const timestamps = [];
      for (let channel of channels) {
        const likes = channel.posts
          .reduce((a, b) => a + b._count.likes, 0);
        const comments = channel.posts 
          .reduce((a, b) => a + b._count.comments, 0);
        const engagement = ((likes + comments) / channel._count.posts) / (channel._count.members);
        const timestamp = await prisma.channelAnalyticsTimestamp.create({
          data: {
            likes: likes,
            comments: comments,
            engagement: engagement,
            channel: {
              connect: { channelId: channel.channelId }
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
