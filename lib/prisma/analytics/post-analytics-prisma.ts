import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPostLikesInRange(lowerBound: Date, upperBound: Date) {
  return prisma.postLikesTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      }
    }
  })
}