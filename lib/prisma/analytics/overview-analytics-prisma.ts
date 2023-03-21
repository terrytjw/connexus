import { PrismaClient } from "@prisma/client";
import { groupCreatorChannelAnalyticsByDate } from "./channel-analytics-prisma";
import { groupCreatorCollectionAnalyticsByDate } from "./collection-analytics-prisma";
import { groupCreatorCommunityAnalyticsByDate } from "./community-analytics-prisma";
import { groupCreatorEventAnalyticsByDate } from "./event-analytics-prisma";

const prisma = new PrismaClient();

// TODO: Find a better way to do this

export async function getOverviewAnalyticsForCSVPDF(userId: number, lowerBound: Date, upperBound: Date) {
  const event = await groupCreatorEventAnalyticsByDate(userId, lowerBound, upperBound);
  const channel = await groupCreatorChannelAnalyticsByDate(userId, lowerBound, upperBound);
  const collection = await groupCreatorCollectionAnalyticsByDate(userId, lowerBound, upperBound);
  const community = await groupCreatorCommunityAnalyticsByDate(userId, lowerBound, upperBound);
  const arr = [event, channel, collection, community]
  arr.sort()
  const response = []
  let count1 = 0, count2 = 0, count3 = 0, count4 = 0
  if (arr[3].length == 0) {
    return [];
  }
  for (let i = 0; i < arr[3].length; i++) {
    let date = arr[3][i].date.toDateString();
    response.push({
      date: date,
      ticketRevenue:
        event[count1] 
          ? date == event[count1].date.toDateString() 
            ? event[count1++]._sum.revenue 
            : undefined
          : undefined,
      merchRevenue: 
        collection[count2] 
          ? date == collection[count2].date.toDateString()
            ? collection[count2++]._sum.revenue 
            : undefined
          : undefined,
      members:
        community[count3] 
          ? date == community[count3].date.toDateString() 
            ? community[count3++]._sum.members 
            : undefined
          : undefined,
      engagement:
        channel[count4] 
          ? date == channel[count4].date.toDateString() 
            ? channel[count4++]._avg.engagement
            : undefined
          : undefined
    });
  }
  return response;
}