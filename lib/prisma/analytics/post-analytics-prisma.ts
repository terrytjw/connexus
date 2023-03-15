import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPostLikesInRange(lowerBound: Date, upperBound: Date) {
  return prisma.postAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    },
    select: { likes: true, date: true},
    include: { post: true }
  })
}