// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../../lib/prisma/prisma-helpers";
import { retrieveAttendee } from "../../../../../lib/prisma/event-prisma";
import { createObjectCsvWriter } from "csv-writer";
import { join } from "path";
import PDFDocument from "pdfkit";

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
  const { query, method } = req;
  const eventId = parseInt(query.eventId as string);

  switch (req.method) {
    case "GET":
      await handleGET(eventId);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(eventId: number) {
    try {
      const response = await retrieveAttendee(eventId);

      const doc = new PDFDocument();

      // Set the response headers to allow file download
      res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
      res.setHeader("Content-Type", "application/pdf");

      // Write the PDF document contents
      doc.pipe(res);
      doc.fontSize(14).text("User data:", { underline: true });
      response.forEach((item) => {
        doc.fontSize(12).text(`User ID: ${item.userId}`);
        doc.fontSize(12).text(`Phone Number: ${item.phoneNumber}`);
        doc.fontSize(12).text(`Display Name: ${item.displayName}`);
        doc.fontSize(12).text(`Username: ${item.username}`);
        doc.fontSize(12).text(`Email: ${item.email}`);
        doc.moveDown();
      });
      doc.end();
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
