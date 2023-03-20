// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createObjectCsvWriter } from "csv-writer";
import { join } from "path";
import { createReadStream } from "fs";
import { promisify } from "util";
import fs from "fs";
import { ErrorResponse, handleError } from "../../../lib/prisma/prisma-helpers";
import { getEventAnalyticsForCSVPDF, groupCreatorEventAnalyticsByDate } from "../../../lib/prisma/analytics/event-analytics-prisma";
import { lastWeek, yesterday } from "../../../utils/date-util";
import { AnalyticsEntity } from "../../../lib/api-helpers/analytics-api";
import { getCollectionAnalyticsForCSVPDF, groupCreatorCollectionAnalyticsByDate } from "../../../lib/prisma/analytics/collection-analytics-prisma";
import { getChannelAnalyticsForCSVPDF, groupCreatorChannelAnalyticsByDate } from "../../../lib/prisma/analytics/channel-analytics-prisma";
import { getCommunityAnalyticsForCSVPDF, groupCreatorCommunityAnalyticsByDate } from "../../../lib/prisma/analytics/community-analytics-prisma";

const unlink = promisify(fs.unlink);

//TODO SWAGGER

/**
 * @swagger
 * /api/analytics/event/csv
 *   comment:
 *     description: Export a list of Event analytics for a specific creator to a CSV file 
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: User ID of the creator
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A url pointing to the csv file
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String | ErrorResponse>
) {
  const { method, query } = req;
  const userId = parseInt(query.id as string);
  const entity = query.entity as string;

  switch (method) {
    case "GET":
      if (query.lowerBound && query.upperBound) {
        const lowerBound = new Date(query.lowerBound as string);
        const upperBound = new Date(query.upperBound as string);
        await handleGET(userId, entity, lowerBound, upperBound);
      } else {
        await handleGET(userId, entity);
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  function mapToHeader(obj: any) {
    console.log(obj)
    return Object.keys(obj).map(x => {
      return {
        id: x,
        title: x.toUpperCase()
      }
    })
  }

  async function handleGET(
    userId: number,
    entity: string, 
    lowerBound: Date = lastWeek(),
    upperBound: Date = yesterday()
  ) {
    try {
      let response: any[] = [];
      switch (entity) {
        case "EVENT":
          response = await getEventAnalyticsForCSVPDF(userId, lowerBound, upperBound);
          break;
        case "COLLECTIONS":
          response = await getCollectionAnalyticsForCSVPDF(userId, lowerBound, upperBound);
          break;
        case "CHANNEL":
          response = await getChannelAnalyticsForCSVPDF(userId, lowerBound, upperBound);
          break;
        case "COMMUNITY":
          response = await getCommunityAnalyticsForCSVPDF(userId, lowerBound, upperBound);
          break;
      }

      const csvWriter = createObjectCsvWriter({
        path: join(process.cwd(), "public", "data.csv"),
        header: mapToHeader(response[0])
      });

      // Write the data to a CSV file
      await csvWriter.writeRecords(response);

      // Set the response headers to allow file download
      res.setHeader("Content-Disposition", "attachment; filename=data.csv");
      res.setHeader("Content-Type", "text/csv");

      // Send the CSV file to the client
      const stream = createReadStream(
        join(process.cwd(), "public", "data.csv")
      );
      stream.pipe(res);

      // Delete the CSV file after a specified amount of time has elapsed
      setTimeout(async () => {
        await unlink(join(process.cwd(), "public", "data.csv"));
      }, 5000); // delete the file after 5 seconds

      } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
