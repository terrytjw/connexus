import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function groupCreatorChannelAnalyticsByDate(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.channelAnalyticsTimestamp.groupBy({
    by: ['date'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      channel: {
        is: {
          community: {
            is: {
              creator: {
                is: { userId: userId }
              }
            }
          }
        }
      }
    },
    orderBy: {
      date: 'asc'
    },
    _sum: {
      likes: true,
      comments: true
    },
    _avg: {
      engagement: true
    }
  })
}

export async function groupCreatorChannelAnalyticsByChannel(userId: number, lowerBound: Date, upperBound: Date) {
  return prisma.channelAnalyticsTimestamp.groupBy({
    by: ['channelId'],
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      channel: {
        is: {
          community: {
            is: {
              creator: {
                is: { userId: userId }
              }
            }
          }
        }
      }
    },
    orderBy: {
      channelId: 'asc'
    },
    _sum: {
      likes: true,
      comments: true
    },
    _avg: {
      engagement: true
    }
  })
}

export async function getChannelAnalyticsByChannel(channelId: number, lowerBound: Date, upperBound: Date) {
  return prisma.channelAnalyticsTimestamp.findMany({
    where: {
      date: {
        lte: upperBound,
        gte: lowerBound
      },
      channelId: channelId
    },
    orderBy: {
      date: 'asc'
    },
  })
}