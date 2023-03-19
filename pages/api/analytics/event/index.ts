// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, EventAnalyticsTimestamp } from "@prisma/client";
import { groupCreatorEventAnalyticsByDate } from "../../../../lib/prisma/analytics/event-analytics-prisma";
import { lastWeek } from "../../../../utils/date-util";

const prisma = new PrismaClient();

// TODO swagger

/**
 * @swagger
 * /api/analytics/post/likes:
 *   get:
 *     description: Returns a single Address object
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         description: String ID of the Address to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Address object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Address"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventAnalyticsTimestamp[] | ErrorResponse | {}>
) {
  const { method, query } = req;
  const userId = parseInt(query.id as string);

  switch (method) {
    case "GET":
      if (query.lowerBound && query.upperBound) {
        const lowerBound = new Date(query.lowerBound as string);
        const upperBound = new Date(query.upperBound as string);
        await handleGET(userId, lowerBound, upperBound);
      } else {
        await handleGET(userId);
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(
    userId: number,
    lowerBound: Date = lastWeek(), 
    upperBound: Date = new Date()
  ) {
    try {
      const response = await groupCreatorEventAnalyticsByDate(userId, lowerBound, upperBound);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
