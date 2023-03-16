import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCommunityClicksInRange(lowerBound: Date, upperBound: Date) {
  return prisma.communityAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { clicks: true, date: true },
    include: { community: true }
  })
}

export async function getCommunityMemberGrowthInRange(lowerBound: Date, upperBound: Date) {
  return prisma.communityAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { members: true, date: true },
    include: { community: true }
  })
}

export async function getCommunityPremiumMemberGrowthInRange(lowerBound: Date, upperBound: Date) {
  // TO DO

  // return prisma.communityAnalyticsTimestamp.findMany({
  //   where: {
  //     date: {
  //       lte: upperBound,
  //       gte: lowerBound
  //     }
  //   },
  //   select: { members: true, date: true },
  //   include: { community: true }
  // })
}