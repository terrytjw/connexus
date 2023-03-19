import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    res.setHeader("Allow", []);
    res.status(405).end(`Method Not Allowed`);
}



// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";
// import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
// import { PrismaClient, ChannelAnalyticsTimestamp } from "@prisma/client";
// import { getChannelAnalyticsInRange } from "../../../lib/prisma/analytics/channel-analytics-prisma";
// import { groupCreatorCommunityAnalyticsByDate } from "../../../lib/prisma/analytics/community-analytics-prisma";
// import { groupCreatorCollectionAnalyticsByDate } from "../../../lib/prisma/analytics/collection-analytics-prisma";
// import { getEventAnalyticsInRange } from "../../../lib/prisma/analytics/event-analytics-prisma";
// import { lastWeek } from "../../../utils/date-util";

// const prisma = new PrismaClient();

// // TODO swagger

// /**
//  * @swagger
//  * /api/analytics/post/likes:
//  *   get:
//  *     description: Returns a single Address object
//  *     parameters:
//  *       - in: path
//  *         name: addressId
//  *         required: true
//  *         description: String ID of the Address to retrieve.
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: A single Address object
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/Address"
//  */

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ChannelAnalyticsTimestamp[] | ErrorResponse | {}>
// ) {
//   const { method, query } = req;
//   const userId = parseInt(query.userId as string);
//   const model = query.model as string;

//   switch (method) {
//     case "GET":
//       if (query.lowerBound && query.upperBound) {
//         const lowerBound = new Date(query.lowerBound as string);
//         const upperBound = new Date(query.upperBound as string);
//         await handleGET(userId, model, lowerBound, upperBound);
//       } else {
//         await handleGET(userId, model);
//       }
//       break;
//     default:
//       res.setHeader("Allow", ["GET"]);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }

//   async function handleGET(
//     userId: number,
//     model: string,
//     lowerBound: Date = lastWeek(), 
//     upperBound: Date = new Date()
//   ) {
//     try {
//       let response;
//       switch(model) {
//         case "CHANNEL":
//           response = await getChannelAnalyticsInRange(userId, lowerBound, upperBound);
//           break;
//         case "COMMUNITY":
//           response = await groupCreatorCommunityAnalyticsByDate(userId, lowerBound, upperBound);
//           break;
//         case "COLLECTION":
//           response = await groupCreatorCollectionAnalyticsByDate(userId, lowerBound, upperBound);
//           break;
//         case "EVENT":
//           response = await getEventAnalyticsInRange(userId, lowerBound, upperBound);
//           break;
//         default:
//           response = {};
//     }
//       res.status(200).json(response);
//     } catch (error) {
//       console.log(error);
//       const errorResponse = handleError(error);
//       res.status(400).json(errorResponse);
//     }
//   }
// }
