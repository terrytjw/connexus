import type { NextApiRequest, NextApiResponse } from "next";
import { generateChannelAnalyticsTimestamps } from "../../../lib/prisma/analytics/channel-analytics-prisma";
import { generateCollectionAnalyticsTimestamps } from "../../../lib/prisma/analytics/collection-analytics-prisma";
import { generateCommunityAnalyticsTimestamps } from "../../../lib/prisma/analytics/community-analytics-prisma";
import { generateEventAnalyticsTimestamps } from "../../../lib/prisma/analytics/event-analytics-prisma";
import { ErrorResponse, handleError } from "../../../lib/prisma/prisma-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorResponse>
) {
  const { method } = req;

  switch (method) {
    case "POST":
      await handlePOST();
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST() {
    try {
      const channelTimestamps = await generateChannelAnalyticsTimestamps();
      const communityTimestamps = await generateCommunityAnalyticsTimestamps();
      const eventTimestamps = await generateEventAnalyticsTimestamps();
      const collectionTimestamps = await generateCollectionAnalyticsTimestamps();

      res.status(200).json({
        channelTimestamps: channelTimestamps,
        communityTimestamps: communityTimestamps,
        eventTimestamps: eventTimestamps,
        collectionTimestamps: collectionTimestamps
      });
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}