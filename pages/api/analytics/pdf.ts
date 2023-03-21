// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit-table";
import { getChannelAnalyticsForCSVPDF } from "../../../lib/prisma/analytics/channel-analytics-prisma";
import { getCollectionAnalyticsForCSVPDF } from "../../../lib/prisma/analytics/collection-analytics-prisma";
import { getCommunityAnalyticsForCSVPDF } from "../../../lib/prisma/analytics/community-analytics-prisma";
import { getEventAnalyticsForCSVPDF } from "../../../lib/prisma/analytics/event-analytics-prisma";
import { getOverviewAnalyticsForCSVPDF } from "../../../lib/prisma/analytics/overview-analytics-prisma";
import { ErrorResponse, handleError } from "../../../lib/prisma/prisma-helpers";
import { lastWeek, yesterday } from "../../../utils/date-util";

/**
 * @swagger
 * /api/events/{eventId}/attendee/csv
 *   comment:
 *     description: Export a list of User objects that are attending the Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID of the Event.
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

  function mapToHeaders(obj: any) {
    return Object.keys(obj).map(x => {
      return {
          label: x.toUpperCase(),
          property: x,
          width: 100,
          renderer: undefined
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
        case "OVERVIEW":
          response = await getOverviewAnalyticsForCSVPDF(userId, lowerBound, upperBound);
      }

      const doc = new PDFDocument();

      // Set the response headers to allow file download
      res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
      res.setHeader("Content-Type", "application/pdf");
      const table = {
        title: `Event Data for ${lowerBound.toDateString()} to ${upperBound.toDateString()}`,
        headers: mapToHeaders(response[0]),
        datas: response
      };
      doc.pipe(res);
       
      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: () => doc.font("Helvetica").fontSize(8)
      });
      
      doc.end();
    } catch (error) {
      console.log(error)
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
