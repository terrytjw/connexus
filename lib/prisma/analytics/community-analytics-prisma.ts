import { ChannelType, PrismaClient } from "@prisma/client";
import { getCommunitiesForAnalytics } from "../community-prisma";

const prisma = new PrismaClient();

export async function groupCreatorCommunityAnalyticsByDate(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.communityAnalyticsTimestamp.groupBy({
    by: ['date'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      community: {
        is: {
          creator: {
            is: { userId: userId }
          }
        }
      }
    },
    orderBy: {
      date: 'asc'
    },
    _sum: {
      members: true,
      premiumMembers: true,
      clicks: true
    }
  })
}

export async function generateCommunityAnalyticsTimestamps() {
  const communities = await getCommunitiesForAnalytics();
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
  return timestamps;
}