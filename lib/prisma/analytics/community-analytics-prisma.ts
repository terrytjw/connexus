import { PrismaClient } from "@prisma/client";

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