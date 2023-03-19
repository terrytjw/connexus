import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { ChannelType, CommunityAnalyticsTimestamp, PrismaClient,} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommunityAnalyticsTimestamp[] | ErrorResponse>
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
      const communities = await prisma.community.findMany({
        include: {
          _count: {
            select: { members: true }
          },
          channels: {
            include: {
              _count: {
                select: { members: true }
              }
            }
          },
          analyticsTimestamps: true
        }
      });
      const timestamps = [];
      for (let community of communities) {
        const prevAnalyticsTimestamp = community.analyticsTimestamps.at(-1);
        const timestamp = await prisma.communityAnalyticsTimestamp.create({
          data: {
            members: community._count.members,
            premiumMembers: community.channels
              .filter(channel => channel.channelType == ChannelType.PREMIUM)
              .reduce((a, b) => a + b._count.members, 0),
            clicks: community.clicks - prevAnalyticsTimestamp!.clicks,
            community: {
              connect: {
                communityId: community.communityId
              }
            }
          }
        })
        timestamps.push(timestamp);
      }
      res.status(200).json(timestamps);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
