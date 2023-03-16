// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, PostAnalyticsTimestamp } from "@prisma/client";
import { getPostAnalyticsInRange } from "../../../../lib/prisma/analytics/post-analytics-prisma";

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
  res: NextApiResponse<PostAnalyticsTimestamp[] | ErrorResponse | {}>
) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      if (query) {
        const lowerBound = new Date(query.lowerBound as string);
        const upperBound = new Date(query.upperBound as string);
        await handleGET(lowerBound, upperBound);
      } else {
        await handleGET();
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(
    lowerBound: Date = new Date(), 
    upperBound: Date = lastWeek()
  ) {
    try {
      const response = await getPostAnalyticsInRange(lowerBound, upperBound);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  function lastWeek() {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    return lastWeek;
  }
}
