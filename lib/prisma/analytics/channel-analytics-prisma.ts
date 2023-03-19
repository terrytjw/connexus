import { PrismaClient } from "@prisma/client";
import { getChannelsForAnalytics } from "../channel-prisma";

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

export async function generateChannelAnalyticsTimestamps() {
  const channels = await getChannelsForAnalytics();
  const timestamps = [];
  for (let channel of channels) {
    const likes = channel.posts
      .reduce((a, b) => a + b._count.likes, 0);
    const comments = channel.posts 
      .reduce((a, b) => a + b._count.comments, 0);    
    const engagement = 
      channel.posts.length > 0
        ? ((likes + comments) / channel._count.posts) / (channel._count.members)
        : 0     
    const date = new Date();
    date.setHours(0, 0, 0, 0) // get rid of time so timestamps on the same day can all be grouped
    const timestamp = await prisma.channelAnalyticsTimestamp.create({
      data: {
        likes: likes,
        comments: comments,
        engagement: engagement,
        date: date,
        channel: {
          connect: { channelId: channel.channelId }
        }
      }
    })
    timestamps.push(timestamp)
  }
  return timestamps;
}