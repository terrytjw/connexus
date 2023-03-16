import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCommunityAnalyticsInRange(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.communityAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      community: {
        is: { creator: {is: { userId: userId }}}
      }
    },
    include: {
      community: {
        select: { communityId: true, name: true }
      }
    },
    orderBy: {
      date: 'asc'
    }
  })
}