import { PrismaClient } from "@prisma/client";
import { yesterday } from "../../../utils/date-util";
import { getCollectionsForAnalytics } from "../collection-prisma";

const prisma = new PrismaClient();

export async function groupCreatorCollectionAnalyticsByDate(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.groupBy({
    by: ['date'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      collection: {
        is: { creatorId: userId }
      }
    },
    _sum: {
      merchSold: true,
      revenue: true,
      clicks: true
    },
  })
}

export async function groupCreatorCollectionAnalyticsByCollection(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.groupBy({
    by: ['collectionId'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      collection: {
        is: { creatorId: userId }
      }
    },
    _sum: {
      merchSold: true,
      revenue: true,
      clicks: true
    },
  })
}

export async function getCollectionAnalyticsByCollection(collectionId: number, lowerBound: Date, upperBound: Date) {
  return prisma.collectionAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      collectionId: collectionId
    },
    orderBy: {
      date: 'asc'
    },
  })
}

export async function generateCollectionAnalyticsTimestamps() {
  const collections = await getCollectionsForAnalytics();
  const timestamps = [];

  for (let collection of collections) {
    const prevAnalyticsTimestamp = collection.analyticsTimestamps.at(-1);
    let merchSold = 0 - collection.analyticsTimestamps
      .reduce((a, b) => a + b.merchSold, 0);

    for (let merch of collection.merchandise) {
      merchSold += merch.currMerchSupply
    }
    const revenue = merchSold * collection.fixedPrice;

    let timestamp = await prisma.collectionAnalyticsTimestamp.create({
      data: {
        merchSold: merchSold,
        revenue: revenue,
        clicks: collection.clicks - prevAnalyticsTimestamp!.clicks,
        date: yesterday(),
        collection: {
          connect: {
            collectionId: collection.collectionId
          }
        }
      }
    });
    timestamps.push(timestamp);
  }
  return timestamps;
}