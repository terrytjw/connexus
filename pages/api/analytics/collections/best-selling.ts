// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, CollectionAnalyticsTimestamp } from "@prisma/client";
import { getTopNSellingCollections, groupCreatorCollectionAnalyticsByDate } from "../../../../lib/prisma/analytics/collection-analytics-prisma";
import { lastWeek, setTo2359, yesterday } from "../../../../utils/date-util";

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
  res: NextApiResponse<CollectionAnalyticsTimestamp[] | ErrorResponse | {}>
) {
  const { method, query } = req;
  const userId = query.id == undefined ? undefined : parseInt(query.id as string);
  const n = query.n == undefined ? undefined : parseInt(query.n as string);

  switch (method) {
    case "GET":
      if (query.lowerBound && query.upperBound) {
        const lowerBound = new Date(query.lowerBound as string);
        const upperBound = new Date(query.upperBound as string);
        await handleGET(n, userId, lowerBound, upperBound);
      } else {
        await handleGET(n, userId);
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(
    n: number = 3,
    userId: number= -1,
    lowerBound: Date = lastWeek(), 
    upperBound: Date = yesterday(),
  ) {
    try {
      const response = await getTopNSellingCollections(userId, lowerBound, upperBound, n);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
